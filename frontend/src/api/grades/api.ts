import APIClient from "api/APIClient";

async function createGrade(
  courseID: string,
  assignmentID: string,
  studentID: string,
  grade: number,
  gradedByID: string
): Promise<string> {
  return APIClient.post(
    `/courses/${courseID}/assignments/${assignmentID}/grades`,
    { studentID, grade, gradedByID }
  );
}

async function updateGrade(
  courseID: string,
  assignmentID: string,
  gradeID: string,
  grade: number,
  gradedByID: string
): Promise<boolean> {
  return APIClient.patch(
    `/courses/${courseID}/assignments/${assignmentID}/grades/${gradeID}`,
    { grade, gradedByID }
  );
}

async function deleteGrade(
  courseID: string,
  assignmentID: string,
  gradeID: string,
): Promise<boolean> {
  return APIClient.delete(
    `/courses/${courseID}/assignments/${assignmentID}/grades/${gradeID}`
  );
}

async function exportGrades(courseID: string): Promise<string> {
  return APIClient.post(`/courses/${courseID}/exportGrades`);
}

const GradeAPI = {
  createGrade,
  updateGrade,
  deleteGrade,
};

export default GradeAPI;
