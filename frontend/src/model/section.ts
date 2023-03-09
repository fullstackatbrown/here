export type Day = "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday"

export interface Section {
  ID: string;
  courseID: string;
  day: Day;
  startTime: string;
  endTime: string;
  location: string;
  capacity: number;
  enrolledStudents: string[];
  swappedInStudents: Record<string, string[]>;
  swappedOutStudents: Record<string, string[]>;
}
