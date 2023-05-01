export const enum CoursePermission {
  CourseAdmin = "admin",
  CourseStaff = "staff",
  CourseStudent = "student",
}

export interface User {
  ID: string;
  displayName: string;
  email: string;
  photoUrl: string;
  courses: string[];
  defaultSections: Record<string, string>;
  actualSections: Record<string, Record<string, string>>;
  isAdmin: boolean;
  permissions: Record<string, CoursePermission>;
  notifications: Notification[];
}

export interface Notification {
  ID: string;
  title: string;
  body: string;
  timestamp: Date;
  type: NotificationType;
}

export const enum NotificationType {
  NotificationReleaseGrades = "RELEASE_GRADES",
  NotificationRequestUpdated = "REQUEST_UPDATED",
  NotificationAnnouncement = "ANNOUNCEMENT"
}