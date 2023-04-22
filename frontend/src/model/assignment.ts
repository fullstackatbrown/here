import { Grade } from "./grades";

export interface Assignment {
  ID: string;
  courseID: string;
  name: string;
  optional: boolean;
  releaseDate: string;
  dueDate: string;
  maxScore: number;
  grades: Record<string, Grade>
}
