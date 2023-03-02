import { Grade } from "./grades";

export interface Assignment {
  id: string;
  name: string;
  mandatory: boolean;
  startDate: Date;
  endDate: Date;
  gradesByStudent: Record<string, string>;
  grades: Grade[];
}
