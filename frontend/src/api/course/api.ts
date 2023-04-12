import APIClient from "api/APIClient";
import { Course } from "model/course";


async function getCourse(courseID: string): Promise<Course> {
  return await APIClient.get(`/courses/${courseID}`, {});
}

async function deleteCourse(courseID: string): Promise<boolean> {
  return APIClient.delete(`/courses/${courseID}`, {});
}

async function assignSections(
  courseID: string,
  studentID?: string,
  sectionID?: string
): Promise<void> {
  return APIClient.post(`/courses/${courseID}/assignSections`, {
    studentID,
    sectionID,
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
  code?: string,
  term?: string,
  autoApproveRequests?: boolean,
  status?: string,
): Promise<string> {
  return APIClient.patch(`/courses/${courseID}`, { title, code, term, autoApproveRequests, status });
}


const CourseAPI = {
  getCourse,
  createCourse,
  deleteCourse,
  updateCourse,
};

export default CourseAPI;
