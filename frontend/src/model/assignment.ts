
export interface Assignment {
  ID: string;
  courseID: string;
  name: string;
  optional: boolean;
  startDate: string;
  endDate: string;
  gradesByStudent: Record<string, string>;
  maxScore: number;
}
