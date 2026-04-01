import type {
  ApiCourse,
  ApiResponse,
  ApiSchedule,
  ApiSemester,
} from "@/api/semesterlyApi";
import { db } from "@/db/client";
import { expandCourseEvents } from "@/db/expandEvents";
import { courses, events, schedules, semesters } from "@/db/schema";
import { and, eq, inArray, isNull } from "drizzle-orm";

function courseIdentityKey(code: string, section: number | null): string {
  return `${code}\u0000${section === null ? "" : String(section)}`;
}

async function syncSemester(apiSemester: ApiSemester): Promise<number> {
  await db
    .insert(semesters)
    .values({
      code: apiSemester.code,
      startDate: apiSemester.startDate,
      endDate: apiSemester.endDate,
    })
    .onConflictDoUpdate({
      target: semesters.code,
      set: { startDate: apiSemester.startDate, endDate: apiSemester.endDate },
    });

  const [row] = await db
    .select({ id: semesters.id })
    .from(semesters)
    .where(eq(semesters.code, apiSemester.code))
    .limit(1);

  return row.id;
}

async function syncSchedule(
  semesterId: number,
  apiSchedule: ApiSchedule,
): Promise<number> {
  const [existing] = await db
    .select({ id: schedules.id })
    .from(schedules)
    .where(
      and(
        eq(schedules.semesterId, semesterId),
        eq(schedules.name, apiSchedule.name),
      ),
    )
    .limit(1);

  if (existing) return existing.id;

  const [inserted] = await db
    .insert(schedules)
    .values({ semesterId, name: apiSchedule.name })
    .returning({ id: schedules.id });

  return inserted.id;
}

async function syncCourse(
  scheduleId: number,
  apiCourse: ApiCourse,
  semesterStart: string,
  semesterEnd: string,
): Promise<void> {
  const sectionFilter =
    apiCourse.section == null
      ? isNull(courses.section)
      : eq(courses.section, apiCourse.section);

  const [existing] = await db
    .select({ id: courses.id })
    .from(courses)
    .where(
      and(
        eq(courses.scheduleId, scheduleId),
        eq(courses.code, apiCourse.code),
        sectionFilter,
      ),
    )
    .limit(1);

  let courseId: number;

  if (existing) {
    await db
      .update(courses)
      .set({
        title: apiCourse.title,
        colorIndex: apiCourse.colorIndex,
        instructor: apiCourse.instructor ?? null,
        location: apiCourse.location ?? null,
      })
      .where(eq(courses.id, existing.id));
    courseId = existing.id;
  } else {
    const [inserted] = await db
      .insert(courses)
      .values({
        scheduleId,
        code: apiCourse.code,
        title: apiCourse.title,
        section: apiCourse.section ?? null,
        colorIndex: apiCourse.colorIndex,
        instructor: apiCourse.instructor ?? null,
        location: apiCourse.location ?? null,
      })
      .returning({ id: courses.id });
    courseId = inserted.id;
  }

  // Always regenerate events from the latest slots.
  await db.delete(events).where(eq(events.courseId, courseId));

  const expanded = expandCourseEvents(
    [
      {
        id: courseId,
        code: apiCourse.code,
        title: apiCourse.title,
        section: apiCourse.section ?? 0,
        colorIndex: apiCourse.colorIndex,
        instructor: apiCourse.instructor ?? "",
        location: apiCourse.location ?? "",
        slots: apiCourse.slots,
      },
    ],
    semesterStart,
    semesterEnd,
    () => "",
  );

  if (expanded.length > 0) {
    await db.insert(events).values(
      expanded.map((e) => ({
        courseId,
        startDateTime: (e.start as { dateTime: string }).dateTime,
        endDateTime: (e.end as { dateTime: string }).dateTime,
      })),
    );
  }
}

/** Delete local courses for this schedule that are not in the API list (events cascade). */
async function removeStaleCoursesForSchedule(
  scheduleId: number,
  apiCourses: ApiCourse[],
): Promise<void> {
  const keep = new Set(
    apiCourses.map((c) => courseIdentityKey(c.code, c.section ?? null)),
  );

  const rows = await db
    .select({ id: courses.id, code: courses.code, section: courses.section })
    .from(courses)
    .where(eq(courses.scheduleId, scheduleId));

  const staleIds = rows
    .filter((row) => !keep.has(courseIdentityKey(row.code, row.section)))
    .map((row) => row.id);

  if (staleIds.length > 0) {
    await db.delete(courses).where(inArray(courses.id, staleIds));
  }
}

/** Delete schedules for this semester whose names are not in the API response. */
async function removeStaleSchedulesForSemester(
  semesterId: number,
  apiScheduleNames: string[],
): Promise<void> {
  const keep = new Set(apiScheduleNames);
  const rows = await db
    .select({ id: schedules.id, name: schedules.name })
    .from(schedules)
    .where(eq(schedules.semesterId, semesterId));

  const staleIds = rows
    .filter((row) => !keep.has(row.name))
    .map((row) => row.id);

  if (staleIds.length > 0) {
    await db.delete(schedules).where(inArray(schedules.id, staleIds));
  }
}

/** Delete semesters not returned by the API (cascades schedules, courses, events). */
async function removeStaleSemesters(apiCodes: string[]): Promise<void> {
  const keep = new Set(apiCodes);
  const rows = await db
    .select({ id: semesters.id, code: semesters.code })
    .from(semesters);

  const staleIds = rows
    .filter((row) => !keep.has(row.code))
    .map((row) => row.id);

  if (staleIds.length > 0) {
    await db.delete(semesters).where(inArray(semesters.id, staleIds));
  }
}

// ─── Public ───────────────────────────────────────────────────────────────────

/**
 * Syncs an API response into the local SQLite database.
 *
 * - Semesters are upserted by `code` (dates updated if changed).
 * - Schedules are created if missing; schedules omitted by the API are removed.
 * - Courses are matched by (scheduleId, code, section): metadata is updated,
 *   events regenerated from slots; courses omitted by the API are removed.
 * - Semesters omitted by the API are removed (cascade).
 */
export async function syncFromApi(data: ApiResponse): Promise<void> {
  console.log(`[sync] Syncing ${data.semesters.length} semester(s)...`);

  for (const apiSemester of data.semesters) {
    const semesterId = await syncSemester(apiSemester);

    for (const apiSchedule of apiSemester.schedules) {
      const scheduleId = await syncSchedule(semesterId, apiSchedule);

      for (const apiCourse of apiSchedule.courses) {
        await syncCourse(
          scheduleId,
          apiCourse,
          apiSemester.startDate,
          apiSemester.endDate,
        );
      }

      await removeStaleCoursesForSchedule(scheduleId, apiSchedule.courses);
    }

    await removeStaleSchedulesForSemester(
      semesterId,
      apiSemester.schedules.map((s) => s.name),
    );
  }

  await removeStaleSemesters(data.semesters.map((s) => s.code));

  console.log("[sync] Done.");
}
