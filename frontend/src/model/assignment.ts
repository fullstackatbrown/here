import { Grade } from "./grades";

export interface Assignment {
  ID: string;
  courseID: string;
  name: string;
  mandatory: boolean;
  startDate: Date;
  endDate: Date;
  gradesByStudent: Record<string, string>;
}
