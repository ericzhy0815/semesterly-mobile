import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const semesters = sqliteTable("semesters", {
  id: int().primaryKey({ autoIncrement: true }),
  code: text().notNull().unique(), // e.g. "FA25"
  startDate: text().notNull(), // "YYYY-MM-DD" — first day of semester
  endDate: text().notNull(), // "YYYY-MM-DD" — last day of semester
  /** User's chosen schedule for this semester. FK to `schedules.id` is in migration (inline `.references` omitted here to avoid TS circular inference with `schedules.semesterId`). */
  activeScheduleId: int(),
});

export const schedules = sqliteTable("schedules", {
  id: int().primaryKey({ autoIncrement: true }),
  semesterId: int()
    .notNull()
    .references(() => semesters.id, { onDelete: "cascade" }),
  name: text().notNull(), // e.g. "Schedule A"
});

export const courses = sqliteTable("courses", {
  id: int().primaryKey({ autoIncrement: true }),
  scheduleId: int()
    .notNull()
    .references(() => schedules.id, { onDelete: "cascade" }),
  title: text().notNull(), // e.g. "Databases"
  code: text().notNull(), // e.g. "EN.601.615"
  section: int(), // e.g. 2
  colorIndex: int().notNull(), // index into lightCourseColors / darkCourseColors
  instructor: text(),
  location: text(),
});

// Pre-expanded calendar occurrences. Cascade delete means removing a course
// wipes its events automatically.
export const events = sqliteTable("events", {
  id: int().primaryKey({ autoIncrement: true }),
  courseId: int()
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  startDateTime: text().notNull(), // ISO-8601 e.g. "2025-09-02T10:00:00"
  endDateTime: text().notNull(), // ISO-8601 e.g. "2025-09-02T11:15:00"
});

// ─── Relations (required for db.query with nested `with`) ─────────────────────

export const semestersRelations = relations(semesters, ({ many }) => ({
  schedules: many(schedules),
}));

export const schedulesRelations = relations(schedules, ({ one, many }) => ({
  semester: one(semesters, {
    fields: [schedules.semesterId],
    references: [semesters.id],
  }),
  courses: many(courses),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  schedule: one(schedules, {
    fields: [courses.scheduleId],
    references: [schedules.id],
  }),
  events: many(events),
}));

export const eventsRelations = relations(events, ({ one }) => ({
  course: one(courses, { fields: [events.courseId], references: [courses.id] }),
}));
