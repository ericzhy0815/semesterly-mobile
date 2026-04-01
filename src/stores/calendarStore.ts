import { db } from "@/db/client";
import { courses, events, schedules, semesters } from "@/db/schema";
import { addDays, fromDayString, toDayString } from "@/lib/date";
import { and, asc, desc, eq, gte, lte } from "drizzle-orm";
import { create } from "zustand";

export type CalendarViewMode = "3day" | "list";

// ─── Types ────────────────────────────────────────────────────────────────────

type Course = typeof courses.$inferSelect;
type Schedule = typeof schedules.$inferSelect & { courses: Course[] };
type Semester = typeof semesters.$inferSelect & { schedules: Schedule[] };

// Flattened event row returned by the JOIN query — everything needed to render
// a calendar block without any follow-up DB calls.
type EventWithCourse = typeof events.$inferSelect & {
  courseCode: string;
  courseTitle: string;
  courseSection: number | null;
  courseLocation: string | null;
  courseColorIndex: number;
};

// ─── Store ────────────────────────────────────────────────────────────────────

type CalendarStore = {
  semesters: Semester[];
  activeSemesterId: number | null;
  activeScheduleId: number | null;
  calendarEvents: EventWithCourse[];

  // Tracks the date range currently loaded in calendarEvents.
  // loadedStart inclusive, loadedEnd exclusive (first date NOT loaded).
  loadedStart: Date;
  loadedEnd: Date;

  /** Current visible date (3-day and list share this). */
  visibleDate: Date;
  setVisibleDate: (date: Date) => void;

  /** 3-day schedule vs list agenda. */
  calendarView: CalendarViewMode;
  setCalendarView: (view: CalendarViewMode) => void;

  /** List view: bottommost visible date (anchor = visibleDate, tail = tailDate). */
  tailDate: Date;
  setTailDate: (date: Date) => void;

  /** List view: indices for extend logic (items from edges). */
  listTopmostIndex: number;
  listBottommostIndex: number;
  listLength: number;
  setListVisibleIndices: (
    topmost: number,
    bottommost: number,
    length: number,
  ) => void;

  /** Current calendar day. Use this so 3-day and list share one source of truth. */
  getTodayDate: () => Date;

  loadSemesters: () => Promise<void>;

  /**
   * Load events from start, sorted by date. limit is required.
   * - limit Date: query [start, limit], set that range.
   * - limit positive number: query [start, start+big window], take first `limit` items.
   * - limit negative number: query [start−big window, start], take last `|limit|` items (events backward from start).
   */
  loadEvents: (startDate: Date, limit: Date | number) => Promise<void>;

  setActiveSemester: (id: number) => void;
  setActiveSchedule: (id: number) => void;
};

const EVENT_SELECT = {
  id: events.id,
  courseId: events.courseId,
  startDateTime: events.startDateTime,
  endDateTime: events.endDateTime,
  courseCode: courses.code,
  courseTitle: courses.title,
  courseSection: courses.section,
  courseLocation: courses.location,
  courseColorIndex: courses.colorIndex,
};

const BIG_DAYS = 3650; // 10 years
const BIG_WINDOW = 1000; // max events when limit is a date range

function todayDate(): Date {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0);
}

/** Resolve which schedule to show for a semester (persisted choice, else first). */
function pickScheduleIdForSemester(semester: Semester): number | null {
  const ids = new Set(semester.schedules.map((s) => s.id));
  if (semester.activeScheduleId != null && ids.has(semester.activeScheduleId)) {
    return semester.activeScheduleId;
  }
  return semester.schedules[0]?.id ?? null;
}

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  semesters: [],
  activeSemesterId: null,
  activeScheduleId: null,
  calendarEvents: [],
  loadedStart: todayDate(),
  loadedEnd: todayDate(),
  visibleDate: todayDate(),
  tailDate: todayDate(),

  setVisibleDate: (date) => set({ visibleDate: date }),
  setTailDate: (date) => set({ tailDate: date }),

  calendarView: "3day",
  setCalendarView: (view) => set({ calendarView: view }),
  listTopmostIndex: 0,
  listBottommostIndex: 0,
  listLength: 0,
  setListVisibleIndices: (topmost, bottommost, length) =>
    set({
      listTopmostIndex: topmost,
      listBottommostIndex: bottommost,
      listLength: length,
    }),

  getTodayDate: todayDate,

  loadSemesters: async () => {
    const allSemesters = await db.query.semesters.findMany({
      with: {
        schedules: {
          with: { courses: true },
        },
      },
    });

    if (allSemesters.length === 0) {
      set({ semesters: [], activeSemesterId: null, activeScheduleId: null });
      return;
    }

    const { activeSemesterId: prevSemId } = get();
    const idSet = new Set(allSemesters.map((s) => s.id));

    let nextSemId = prevSemId;
    if (nextSemId == null || !idSet.has(nextSemId)) {
      nextSemId = allSemesters[0].id;
    }

    const sem = allSemesters.find((s) => s.id === nextSemId)!;
    const nextSchId = pickScheduleIdForSemester(sem as Semester);

    set({
      semesters: allSemesters as Semester[],
      activeSemesterId: nextSemId,
      activeScheduleId: nextSchId,
    });
  },

  loadEvents: async (startDate, limit) => {
    let queryStartStr = toDayString(startDate);
    let queryEndStr: string;
    let backward = false;
    let rowLimit: number;

    if (typeof limit === "number") {
      rowLimit = Math.abs(limit);
      if (limit < 0) {
        queryStartStr = toDayString(addDays(startDate, -BIG_DAYS));
        queryEndStr = toDayString(startDate);
        backward = true;
      } else {
        queryEndStr = toDayString(addDays(startDate, BIG_DAYS));
      }
    } else {
      queryEndStr = toDayString(limit);
      rowLimit = BIG_WINDOW;
    }

    const q = db
      .select(EVENT_SELECT)
      .from(events)
      .innerJoin(courses, eq(events.courseId, courses.id))
      .where(
        and(
          gte(events.startDateTime, queryStartStr + "T00:00:00"),
          lte(events.startDateTime, queryEndStr + "T23:59:59"),
        ),
      )
      .orderBy(
        backward ? desc(events.startDateTime) : asc(events.startDateTime),
      )
      .limit(rowLimit);

    let rows = await q;
    if (backward) rows = rows.reverse();

    set({
      calendarEvents: rows,
      loadedStart: fromDayString(queryStartStr),
      loadedEnd: addDays(fromDayString(queryEndStr), 1),
    });
  },

  setActiveSemester: (id) => {
    const { semesters: sems } = get();
    const sem = sems.find((s) => s.id === id);
    const schId = sem ? pickScheduleIdForSemester(sem) : null;
    set({ activeSemesterId: id, activeScheduleId: schId });
  },

  setActiveSchedule: (id) => {
    const { activeSemesterId, semesters: sems } = get();
    if (activeSemesterId == null) return;
    const sem = sems.find((s) => s.id === activeSemesterId);
    if (!sem?.schedules.some((s) => s.id === id)) return;

    set({
      activeScheduleId: id,
      semesters: sems.map((s) =>
        s.id === activeSemesterId ? { ...s, activeScheduleId: id } : s,
      ) as Semester[],
    });
    void db
      .update(semesters)
      .set({ activeScheduleId: id })
      .where(eq(semesters.id, activeSemesterId));
  },
}));
