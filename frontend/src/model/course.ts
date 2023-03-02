import { Grade } from "./grades";

export interface Course {
  ID: string;
  title: string;
  code: string;
  term: string;
  sectionIDs: string[];
  gradeOptions: string[];
  students: Record<string, string>;
  surveyID: string;
}
