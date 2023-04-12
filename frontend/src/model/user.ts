type CoursePermission = string

export const CourseAdmin: CoursePermission = "ADMIN"
export const CourseStaff: CoursePermission = "STAFF"


export interface User {
  ID: string;
  displayName: string;
  email: string;
  pronouns: string;
  photoUrl: string;
  courses: string[];
  defaultSection: Record<string, string>;
  actualSection: Record<string, Record<string, string>>;
  isAdmin: boolean;
  permissions: Record<string, CoursePermission>;
}