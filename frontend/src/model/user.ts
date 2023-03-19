export interface User {
  ID: string;
  displayName: string;
  email: string;
  access: Record<string, string>;
  courses: string[];
  defaultSection: Record<string, string>;
  actualSection: Record<string, Record<string, string>>;
}