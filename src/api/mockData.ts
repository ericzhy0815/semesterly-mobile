const hm = (h: number, m: number) => h * 60 + m;

type MockTimeSlot = {
  dayOfWeek: number; // 0 = Sunday … 6 = Saturday
  startTime: number; // minutes since midnight
  endTime: number;
};

type MockCourseData = {
  code: string;
  title: string;
  section: number;
  colorIndex: number;
  instructor: string;
  location: string;
  slots: MockTimeSlot[];
};

type MockSemesterData = {
  code: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;
};

// ─── Semesters ────────────────────────────────────────────────────────────────

export const MOCK_SEMESTERS: MockSemesterData[] = [
  { code: "SP26", startDate: "2026-01-26", endDate: "2026-05-14" },
  { code: "FA25", startDate: "2025-08-25", endDate: "2025-12-12" },
  { code: "SP25", startDate: "2025-01-27", endDate: "2025-05-15" },
  { code: "FA24", startDate: "2024-08-26", endDate: "2024-12-13" },
  { code: "SP24", startDate: "2024-01-22", endDate: "2024-05-10" },
];

// ─── Schedules ────────────────────────────────────────────────────────────────

export const MOCK_SCHEDULES = ["Schedule A", "Schedule B", "Schedule C"];
export const DEFAULT_SEMESTER_CODE = "SP26";
export const DEFAULT_SCHEDULE = MOCK_SCHEDULES[0];

// ─── Courses ──────────────────────────────────────────────────────────────────

// Courses for SP26 / Schedule A. colorIndex maps to lightCourseColors /
// darkCourseColors by position — 0 = red, 1 = blue, 2 = turquoise, 3 = yellow.
export const MOCK_COURSES_SP26: MockCourseData[] = [
  {
    code: "EN.553.600",
    title: "Mathematical Modeling and Consulting",
    section: 1,
    colorIndex: 0,
    instructor: "Dr. Smith",
    location: "Shaffer 302",
    slots: [
      { dayOfWeek: 1, startTime: hm(9, 0), endTime: hm(9, 50) }, // Mon
      { dayOfWeek: 3, startTime: hm(9, 0), endTime: hm(9, 50) }, // Wed
      { dayOfWeek: 4, startTime: hm(4, 30), endTime: hm(5, 20) }, // Thu
      { dayOfWeek: 5, startTime: hm(9, 0), endTime: hm(9, 50) }, // Fri
    ],
  },
  {
    code: "EN.601.641",
    title: "Blockchains and Cryptocurrencies",
    section: 1,
    colorIndex: 1,
    instructor: "Dr. Johnson",
    location: "Hackerman B17",
    slots: [
      { dayOfWeek: 1, startTime: hm(15, 0), endTime: hm(16, 15) }, // Mon
      { dayOfWeek: 3, startTime: hm(15, 0), endTime: hm(16, 15) }, // Wed
    ],
  },
  {
    code: "EN.553.636",
    title: "Introduction to Data Science",
    section: 2,
    colorIndex: 2,
    instructor: "Dr. Lee",
    location: "Krieger 180",
    slots: [
      { dayOfWeek: 1, startTime: hm(16, 30), endTime: hm(17, 45) }, // Mon
      { dayOfWeek: 4, startTime: hm(16, 30), endTime: hm(17, 45) }, // Wed
    ],
  },
  {
    code: "EN.601.615",
    title: "Databases",
    section: 2,
    colorIndex: 3,
    instructor: "Dr. Park",
    location: "Hodson 214",
    slots: [
      { dayOfWeek: 2, startTime: hm(12, 0), endTime: hm(13, 15) }, // Tue
      { dayOfWeek: 3, startTime: hm(12, 0), endTime: hm(13, 15) }, // Thu
    ],
  },
  {
    code: "EN.601.614",
    title: "Computer Networks",
    section: 2,
    colorIndex: 4,
    instructor: "Dr. Park",
    location: "Hodson 214",
    slots: [
      { dayOfWeek: 2, startTime: hm(13, 30), endTime: hm(14, 45) }, // Tue
      { dayOfWeek: 4, startTime: hm(13, 30), endTime: hm(14, 45) }, // Thu
    ],
  },
];

// FA25 / Schedule A
export const MOCK_COURSES_FA25: MockCourseData[] = [
  {
    code: "EN.601.433",
    title: "Algorithms",
    section: 1,
    colorIndex: 0,
    instructor: "Dr. Chen",
    location: "Hackerman B111",
    slots: [
      { dayOfWeek: 2, startTime: hm(10, 30), endTime: hm(11, 45) }, // Tue
      { dayOfWeek: 4, startTime: hm(10, 30), endTime: hm(11, 45) }, // Thu
    ],
  },
  {
    code: "EN.601.419",
    title: "Operating Systems",
    section: 1,
    colorIndex: 1,
    instructor: "Dr. Martinez",
    location: "NEB 218",
    slots: [
      { dayOfWeek: 1, startTime: hm(13, 30), endTime: hm(14, 45) }, // Mon
      { dayOfWeek: 3, startTime: hm(13, 30), endTime: hm(14, 45) }, // Wed
    ],
  },
  {
    code: "EN.553.450",
    title: "Probability for Statistics",
    section: 1,
    colorIndex: 2,
    instructor: "Dr. Patel",
    location: "Shaffer 300",
    slots: [
      { dayOfWeek: 2, startTime: hm(15, 0), endTime: hm(16, 15) }, // Tue
      { dayOfWeek: 5, startTime: hm(12, 0), endTime: hm(12, 50) }, // Fri
    ],
  },
  {
    code: "EN.601.620",
    title: "Machine Learning",
    section: 1,
    colorIndex: 3,
    instructor: "Dr. Kumar",
    location: "Malone 228",
    slots: [
      { dayOfWeek: 1, startTime: hm(16, 30), endTime: hm(17, 45) }, // Mon
      { dayOfWeek: 4, startTime: hm(16, 30), endTime: hm(17, 45) }, // Thu
    ],
  },
  {
    code: "EN.600.636",
    title: "Software Verification and Validation",
    section: 1,
    colorIndex: 4,
    instructor: "Dr. Nguyen",
    location: "Hodson 210",
    slots: [
      { dayOfWeek: 3, startTime: hm(9, 0), endTime: hm(10, 15) }, // Wed
      { dayOfWeek: 5, startTime: hm(9, 0), endTime: hm(9, 50) }, // Fri
    ],
  },
];

// SP25 / Schedule A
export const MOCK_COURSES_SP25: MockCourseData[] = [
  {
    code: "EN.601.421",
    title: "Distributed Systems",
    section: 1,
    colorIndex: 0,
    instructor: "Dr. Anderson",
    location: "Hackerman B17",
    slots: [
      { dayOfWeek: 1, startTime: hm(15, 0), endTime: hm(16, 15) }, // Mon
      { dayOfWeek: 3, startTime: hm(15, 0), endTime: hm(16, 15) }, // Wed
    ],
  },
  {
    code: "EN.553.627",
    title: "Statistical Methods",
    section: 1,
    colorIndex: 1,
    instructor: "Dr. Brooks",
    location: "Krieger 205",
    slots: [
      { dayOfWeek: 2, startTime: hm(9, 0), endTime: hm(10, 15) }, // Tue
      { dayOfWeek: 4, startTime: hm(9, 0), endTime: hm(10, 15) }, // Thu
    ],
  },
  {
    code: "EN.601.646",
    title: "Natural Language Processing",
    section: 1,
    colorIndex: 2,
    instructor: "Dr. Kim",
    location: "Malone 228",
    slots: [
      { dayOfWeek: 2, startTime: hm(13, 30), endTime: hm(14, 45) }, // Tue
      { dayOfWeek: 4, startTime: hm(13, 30), endTime: hm(14, 45) }, // Thu
    ],
  },
  {
    code: "EN.601.440",
    title: "Compilers",
    section: 1,
    colorIndex: 3,
    instructor: "Dr. Wright",
    location: "NEB 218",
    slots: [
      { dayOfWeek: 1, startTime: hm(10, 30), endTime: hm(11, 45) }, // Mon
      { dayOfWeek: 4, startTime: hm(10, 30), endTime: hm(11, 45) }, // Thu
    ],
  },
  {
    code: "EN.553.613",
    title: "Applied Mathematics and Statistics",
    section: 1,
    colorIndex: 4,
    instructor: "Dr. Foster",
    location: "Shaffer 302",
    slots: [
      { dayOfWeek: 3, startTime: hm(9, 0), endTime: hm(10, 15) }, // Wed
      { dayOfWeek: 5, startTime: hm(9, 0), endTime: hm(9, 50) }, // Fri
    ],
  },
];

// FA24 / Schedule A
export const MOCK_COURSES_FA24: MockCourseData[] = [
  {
    code: "EN.601.414",
    title: "Data Structures and Algorithms",
    section: 1,
    colorIndex: 0,
    instructor: "Dr. Evans",
    location: "Hackerman B111",
    slots: [
      { dayOfWeek: 2, startTime: hm(12, 0), endTime: hm(13, 15) }, // Tue
      { dayOfWeek: 4, startTime: hm(12, 0), endTime: hm(13, 15) }, // Thu
    ],
  },
  {
    code: "EN.553.626",
    title: "Linear Algebra",
    section: 1,
    colorIndex: 1,
    instructor: "Dr. Ross",
    location: "Krieger 180",
    slots: [
      { dayOfWeek: 1, startTime: hm(9, 0), endTime: hm(9, 50) }, // Mon
      { dayOfWeek: 3, startTime: hm(9, 0), endTime: hm(9, 50) }, // Wed
      { dayOfWeek: 5, startTime: hm(9, 0), endTime: hm(9, 50) }, // Fri
    ],
  },
  {
    code: "EN.601.318",
    title: "Automata and Computational Theory",
    section: 1,
    colorIndex: 2,
    instructor: "Dr. Hayes",
    location: "NEB 218",
    slots: [
      { dayOfWeek: 1, startTime: hm(13, 30), endTime: hm(14, 45) }, // Mon
      { dayOfWeek: 3, startTime: hm(13, 30), endTime: hm(14, 45) }, // Wed
    ],
  },
  {
    code: "EN.601.654",
    title: "Human-Computer Interaction",
    section: 1,
    colorIndex: 3,
    instructor: "Dr. Morgan",
    location: "Malone 228",
    slots: [
      { dayOfWeek: 2, startTime: hm(15, 0), endTime: hm(16, 15) }, // Tue
      { dayOfWeek: 5, startTime: hm(12, 0), endTime: hm(12, 50) }, // Fri
    ],
  },
  {
    code: "EN.553.627",
    title: "Statistical Methods",
    section: 2,
    colorIndex: 4,
    instructor: "Dr. Brooks",
    location: "Shaffer 300",
    slots: [
      { dayOfWeek: 2, startTime: hm(9, 0), endTime: hm(10, 15) }, // Tue
      { dayOfWeek: 4, startTime: hm(9, 0), endTime: hm(10, 15) }, // Thu
    ],
  },
];

// SP24 / Schedule A
export const MOCK_COURSES_SP24: MockCourseData[] = [
  {
    code: "EN.601.229",
    title: "Object-Oriented Software Engineering",
    section: 1,
    colorIndex: 0,
    instructor: "Dr. Collins",
    location: "Hackerman B17",
    slots: [
      { dayOfWeek: 1, startTime: hm(12, 0), endTime: hm(13, 15) }, // Mon
      { dayOfWeek: 3, startTime: hm(12, 0), endTime: hm(13, 15) }, // Wed
    ],
  },
  {
    code: "EN.553.413",
    title: "Applied Statistics and Data Analysis",
    section: 1,
    colorIndex: 1,
    instructor: "Dr. Reed",
    location: "Krieger 205",
    slots: [
      { dayOfWeek: 2, startTime: hm(10, 30), endTime: hm(11, 45) }, // Tue
      { dayOfWeek: 4, startTime: hm(10, 30), endTime: hm(11, 45) }, // Thu
    ],
  },
  {
    code: "EN.601.680",
    title: "Cryptography",
    section: 1,
    colorIndex: 2,
    instructor: "Dr. Stone",
    location: "Hodson 214",
    slots: [
      { dayOfWeek: 2, startTime: hm(13, 30), endTime: hm(14, 45) }, // Tue
      { dayOfWeek: 4, startTime: hm(13, 30), endTime: hm(14, 45) }, // Thu
    ],
  },
  {
    code: "EN.601.486",
    title: "Computer Security",
    section: 1,
    colorIndex: 3,
    instructor: "Dr. Vega",
    location: "NEB 218",
    slots: [
      { dayOfWeek: 1, startTime: hm(13, 30), endTime: hm(14, 45) }, // Mon
      { dayOfWeek: 4, startTime: hm(16, 30), endTime: hm(17, 45) }, // Thu
    ],
  },
  {
    code: "EN.553.433",
    title: "Numerical Methods",
    section: 1,
    colorIndex: 4,
    instructor: "Dr. Price",
    location: "Shaffer 302",
    slots: [
      { dayOfWeek: 3, startTime: hm(15, 0), endTime: hm(16, 15) }, // Wed
      { dayOfWeek: 5, startTime: hm(9, 0), endTime: hm(9, 50) }, // Fri
    ],
  },
];

export const MOCK_COURSES_BY_SEMESTER: Record<string, MockCourseData[]> = {
  SP26: MOCK_COURSES_SP26,
  FA25: MOCK_COURSES_FA25,
  SP25: MOCK_COURSES_SP25,
  FA24: MOCK_COURSES_FA24,
  SP24: MOCK_COURSES_SP24,
};

export function getMockCoursesForSemester(code: string): MockCourseData[] {
  return MOCK_COURSES_BY_SEMESTER[code] ?? MOCK_COURSES_SP26;
}
