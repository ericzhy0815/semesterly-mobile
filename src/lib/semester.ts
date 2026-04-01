/** Semester codes like FA25, SP25 → display "Fall 25", "Spring 25" */
export function semesterLabel(code: string): string {
  const term = code.slice(0, 2).toUpperCase();
  const year = code.slice(2);
  if (term === "FA") return `Fall ${year}`;
  if (term === "SP") return `Spring ${year}`;
  return code;
}
