import {
  DEFAULT_SCHEDULE,
  getMockCoursesForSemester,
  MOCK_SCHEDULES,
  MOCK_SEMESTERS,
} from "./mockData";

// ─── Response types ───────────────────────────────────────────────────────────

export type ApiTimeSlot = {
  dayOfWeek: number; // 0 = Sunday … 6 = Saturday
  startTime: number; // minutes since midnight  e.g. 600 = 10:00am
  endTime: number;
};

export type ApiCourse = {
  code: string;
  title: string;
  section: number | null;
  colorIndex: number;
  instructor: string | null;
  location: string | null;
  slots: ApiTimeSlot[];
};

export type ApiSchedule = {
  name: string;
  courses: ApiCourse[];
};

export type ApiSemester = {
  code: string;
  startDate: string; // "YYYY-MM-DD"
  endDate: string; // "YYYY-MM-DD"
  schedules: ApiSchedule[];
};

export type ApiResponse = {
  semesters: ApiSemester[];
};

// ─── Mock response ────────────────────────────────────────────────────────────

const MOCK_RESPONSE: ApiResponse = {
  semesters: MOCK_SEMESTERS.map((sem) => ({
    ...sem,
    schedules: MOCK_SCHEDULES.map((name) => ({
      name,
      courses:
        name === DEFAULT_SCHEDULE ? getMockCoursesForSemester(sem.code) : [],
    })),
  })),
};

// ─── Client ───────────────────────────────────────────────────────────────────

/**
 * Fetches the user's full schedule from the Semesterly API.
 * Returns mock data until the real backend is wired up.
 */
export async function fetchUserSchedule(): Promise<ApiResponse> {
  // TODO: swap for real request:
  // const res = await fetch("https://api.semesterly.com/v1/schedule", {
  //   headers: { Authorization: `Bearer ${token}` },
  // });
  // if (!res.ok) throw new Error(`API error ${res.status}`);
  // return res.json() as Promise<ApiResponse>;

  return MOCK_RESPONSE;
}
