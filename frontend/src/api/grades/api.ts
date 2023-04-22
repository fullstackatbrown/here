import APIClient from "api/APIClient";

async function createGrade(
  courseID: string,
  assignmentID: string,
  studentID: string,
  grade: number,
): Promise<string> {
  return APIClient.post(
    `/courses/${courseID}/assignments/${assignmentID}/grades`,
    { studentID, grade }
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

const GradeAPI = {
  createGrade,
  deleteGrade,
};

export default GradeAPI;
