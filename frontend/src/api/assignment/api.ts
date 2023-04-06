import APIClient from "api/APIClient";
import { Assignment } from "model/assignment";

async function getAssignments(courseID: string): Promise<Assignment[]> {
  return APIClient.get(`/courses/${courseID}/assignments`);
}

async function getAssignmentByID(
  courseID: string,
  assignmentID: string
): Promise<Assignment> {
  return APIClient.get(`/courses/${courseID}/assignments/${assignmentID}`);
}

async function deleteAssignment(
  courseID: string,
  assignmentID: string
): Promise<boolean> {
  return APIClient.delete(`/courses/${courseID}/assignments/${assignmentID}`);
}

async function createAssignment(
  courseID: string,
  name: string,
  optional: boolean,
  releaseDate: string,
  dueDate: string,
  maxScore: number
): Promise<string> {
  return APIClient.post(`/courses/${courseID}/assignments`, {
    name,
    optional,
    releaseDate,
    dueDate,
    maxScore
  });
}

async function updateAssignment(
  courseID: string,
  assignmentID: string,
  name: string,
  optional: boolean,
  releaseDate: string,
  dueDate: string,
  maxScore: number
): Promise<string> {
  return APIClient.patch(`/courses/${courseID}/assignments/${assignmentID}`, {
    name,
    optional,
    releaseDate,
    dueDate,
    maxScore
  });
}

const AssignmentAPI = {
  getAssignments,
  getAssignmentByID,
  deleteAssignment,
  createAssignment,
  updateAssignment,
};

export default AssignmentAPI;
