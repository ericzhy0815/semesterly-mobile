import type { EventItem } from "@howljs/calendar-kit";

type TimeSlot = {
  dayOfWeek: number; // 0 = Sunday … 6 = Saturday
  startTime: number; // minutes since midnight  e.g. 600 = 10:00am
  endTime: number;
};

export type CourseWithSlots = {
  id: number;
  code: string;
  title: string;
  section: number;
  colorIndex: number;
  location: string;
  instructor: string;
  slots: TimeSlot[];
};

const pad = (n: number) => String(n).padStart(2, "0");

function minutesToTime(minutes: number): string {
  return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}:00`;
}

/**
 * Expands a list of courses with recurring time slots into individual
 * calendar EventItems for every occurrence between semesterStart and semesterEnd.
 *
 * @param courses         Courses for the active schedule
 * @param semesterStart   "YYYY-MM-DD" first day of semester
 * @param semesterEnd     "YYYY-MM-DD" last day of semester
 * @param getCourseColor  Maps course index → hex color string
 */
export function expandCourseEvents(
  courses: CourseWithSlots[],
  semesterStart: string,
  semesterEnd: string,
  getCourseColor: (index: number) => string,
): EventItem[] {
  const events: EventItem[] = [];
  const endDate = new Date(semesterEnd + "T23:59:59");

  courses.forEach((course, courseIndex) => {
    const color = getCourseColor(courseIndex);

    for (const slot of course.slots) {
      // Find first occurrence of slot.dayOfWeek on or after semesterStart
      const cursor = new Date(semesterStart + "T00:00:00");
      const daysUntilFirst = (slot.dayOfWeek - cursor.getDay() + 7) % 7;
      cursor.setDate(cursor.getDate() + daysUntilFirst);

      while (cursor <= endDate) {
        const dateStr = cursor.toISOString().slice(0, 10);
        events.push({
          id: `course-${course.id}-${dateStr}-dow${slot.dayOfWeek}`,
          title: course.code,
          start: { dateTime: `${dateStr}T${minutesToTime(slot.startTime)}` },
          end: { dateTime: `${dateStr}T${minutesToTime(slot.endTime)}` },
          color,
        });
        cursor.setDate(cursor.getDate() + 7);
      }
    }
  });

  return events;
}
