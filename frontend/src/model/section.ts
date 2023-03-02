export enum Day {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  UNRECOGNIZED = -1,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

export interface Section {
  id: string;
  day: Day;
  startTime: string;
  endTime: string;
  location: string;
  capacity: number;
  numStudentsEnrolled: number;
  enrolledStudents: string[];
  swappedInStudents: Record<string, string[]>;
  swappedOutStudents: Record<string, string[]>;
}
