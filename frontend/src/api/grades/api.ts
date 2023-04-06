import APIClient from "api/APIClient";

async function createGrade(
  courseID: string,
  assignmentID: string,
  studentID: string,
  grade: number,
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
  grade: number,
  taID: string
): Promise<boolean> {
  return APIClient.patch(
    `/courses/${courseID}/assignments/${assignmentID}/grades/${gradeID}`,
    { studentID, grade, taID }
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
