import { CoursePermission } from "./user";

export const enum CourseStatus {
  CourseArchived = "archived",
  CourseInactive = "inactive",
  CourseActive = "active",
}

export interface SinglePermissionRequest {
  email: string;
  permission: CoursePermission;
}

export interface createCourseAndPermissionsRequest {
  title: string;
  code: string;
  term: string;
  permissions: SinglePermissionRequest[];
}

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
  status: CourseStatus;
  autoApproveRequests: boolean;
  students: Record<string, CourseUserData>;
  permissions: Record<string, CoursePermission>;
}