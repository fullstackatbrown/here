export interface Course {
  ID: string;
  title: string;
  code: string;
  term: string;
  students?: Record<string, string>;
  surveyID?: string;
  sectionIDs?: string[];
  assignmentIDs?: string[];
  swapRequests?: string[];
}
