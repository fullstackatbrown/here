export enum Day {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
  UNRECOGNIZED = -1,
}

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
