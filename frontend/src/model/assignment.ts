
export interface Assignment {
  ID: string;
  courseID: string;
  name: string;
  optional: boolean;
  startDate: Date;
  endDate: Date;
  gradesByStudent: Record<string, string>;
}
