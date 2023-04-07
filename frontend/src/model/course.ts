export interface CourseUserData {
  studentID: string;
  email: string;
  displayName: string;
  pronouns: string;
  defaultSection: string;
}

export interface Course {
  ID: string;
  title: string;
  code: string;
  term: string;
  students?: Record<string, CourseUserData>;
  surveyID?: string;
  sectionIDs?: string[];
  assignmentIDs?: string[];
  swapRequests?: string[];
}
