import { Grade } from "./grades";

export interface Assignment {
  ID: string;
  courseID: string;
  name: string;
  optional: boolean;
  releaseDate: Date;
  dueDate: Date;
  maxScore: number;
  grades: Record<string, Grade>
}
