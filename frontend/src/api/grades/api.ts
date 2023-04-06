import APIClient from "api/APIClient";
import { Grade } from "../../model/grades";

async function getGradesByAssignmentID(
  courseID: string,
  assignmentID: string
): Promise<Grade[]> {
  return APIClient.get(
    `/courses/${courseID}/assignments/${assignmentID}/grades`
  );
}

// ! This might be changed?
async function getGradesByStudentID(
  courseID: string,
  studentID: string
): Promise<Grade[]> {
  return APIClient.get(`/courses/${courseID}/grades`);
}

async function createGrade(
  courseID: string,
  assignmentID: string,
  studentID: string,
  grade: string,
  taID: string
): Promise<string> {
  return APIClient.post(
    `/courses/${courseID}/assignments/${assignmentID}/grades`,
    { studentID, grade, taID }
  );
}

async function updateGrade(
  courseID: string,
  assignmentID: string,
  gradeID: string,
  studentID: string,
  grade: string,
  taID: string
): Promise<boolean> {
  return APIClient.patch(
    `/courses/${courseID}/assignments/${assignmentID}/grades/${gradeID}`,
    { studentID, grade, taID }
  );
}

async function exportGrades(courseID: string): Promise<string> {
  return APIClient.post(`/courses/${courseID}/exportGrades`);
}

const GradeAPI = {
  getGradesByAssignmentID,
  getGradesByStudentID,
  createGrade,
  updateGrade,
};

export default GradeAPI;
