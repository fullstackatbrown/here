
export interface Assignment {
  ID: string;
  courseID: string;
  name: string;
  optional: boolean;
  releaseDate: string;
  dueDate: string;
  gradesByStudent: Record<string, string>;
  maxScore: number;
}
