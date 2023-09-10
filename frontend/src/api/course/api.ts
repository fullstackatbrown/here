import APIClient from "api/APIClient";
import { CourseConfig, createCourseAndPermissionsRequest } from "model/course";
import { CoursePermission } from "model/user";

async function deleteCourse(courseID: string): Promise<boolean> {
  return APIClient.delete(`/courses/${courseID}`, {});
}

async function assignSection(
  courseID: string,
  studentID: string,
  newSectionID: string
): Promise<void> {
  return APIClient.post(`/courses/${courseID}/assignSection`, {
    studentID,
    newSectionID,
  });
}

async function createCourse(
  title: string,
  code: string,
  term: string,
): Promise<string> {
  return APIClient.post(`/courses/`, { title, code, term });
}

async function updateCourse(
  courseID: string,
  title?: string,
  config?: CourseConfig,
  status?: string,
): Promise<string> {
  return APIClient.patch(`/courses/${courseID}`, { title, config, status });
}

async function updateCourseInfo(
  courseID: string,
  title: string,
  code: string,
  term: string,
): Promise<string> {
  return APIClient.patch(`/courses/${courseID}/info`, { title, code, term });
}

async function addPermission(
  courseID: string,
  email: string,
  permission: CoursePermission,
): Promise<string> {
  return APIClient.patch(`/courses/${courseID}/permissions/add`, { email, permission });
}

async function revokePermission(
  courseID: string,
  userID?: string,
  email?: string
): Promise<boolean> {
  return APIClient.patch(`/courses/${courseID}/permissions/revoke`, { userID, email });
}

async function addStudent(
  courseID: string,
  email: string
): Promise<string> {
  return APIClient.patch(`/courses/${courseID}/permissions/addStudent`, { email });
}

async function bulkAddStudent(
  courseID: string,
  emails: string[]
): Promise<string> {
  return APIClient.patch(`/courses/${courseID}/permissions/bulkAddStudent`, { emails });
}

async function deleteStudent(
  courseID: string,
  userID?: string,
  email?: string
): Promise<boolean> {
  return APIClient.patch(`/courses/${courseID}/permissions/deleteStudent`, { userID, email });
}

async function bulkUpload(
  requests: createCourseAndPermissionsRequest[],
): Promise<string> {
  return APIClient.post(`/courses/bulkUpload`, { requests });
}

const CourseAPI = {
  createCourse,
  deleteCourse,
  updateCourse,
  updateCourseInfo,
  addPermission,
  revokePermission,
  bulkUpload,
  addStudent,
  bulkAddStudent,
  deleteStudent,
  assignSection,
};

export default CourseAPI;
