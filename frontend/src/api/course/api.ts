import APIClient from "api/APIClient";
import { AddPermissionRequest, Course, createCourseAndPermissionsRequest } from "model/course";
import { CoursePermission } from "model/user";


async function getCourse(courseID: string): Promise<Course> {
  return await APIClient.get(`/courses/${courseID}`, {});
}

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
  autoApproveRequests?: boolean,
  status?: string,
): Promise<string> {
  return APIClient.patch(`/courses/${courseID}`, { title, autoApproveRequests, status });
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

async function authorizeGapi(courseID: string, redirectUrl: string) {
  var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

  // Create <form> element to submit parameters to OAuth 2.0 endpoint.
  var form = document.createElement('form');
  form.setAttribute('method', 'GET'); // Send as a GET request.
  form.setAttribute('action', oauth2Endpoint);

  // Parameters to pass to OAuth 2.0 endpoint.
  var params = {
    'client_id': process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    'redirect_uri': `${process.env.NEXT_PUBLIC_API_URL}/courses/gapi/authorizeCallback`,
    'response_type': 'code',
    'scope': 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/gmail.send',
    'include_granted_scopes': 'true',
    'state': JSON.stringify({ redirectUrl, courseID }),
    'access_type': 'offline',
    'prompt': 'consent',
  };

  // Add form parameters as hidden input values.
  for (var p in params) {
    var input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('name', p);
    input.setAttribute('value', params[p]);
    form.appendChild(input);
  }

  // Add form to page and submit it to open the OAuth 2.0 endpoint.
  document.body.appendChild(form);
  form.submit();
}

async function sendEmail(courseID: string) {
  return APIClient.post(`/courses/${courseID}/gapi/email`, {});
}

const CourseAPI = {
  getCourse,
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
  authorizeGapi,
  sendEmail,
};

export default CourseAPI;
