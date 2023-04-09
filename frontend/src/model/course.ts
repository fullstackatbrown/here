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
  entryCode: string;
  autoApproveRequests: boolean;
  students?: Record<string, CourseUserData>;
}
