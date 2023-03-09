import APIClient from "@util/APIClient";
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
  mandatory: boolean,
  startDate: Date,
  endDate: Date
): Promise<string> {
  return APIClient.post(`/courses/${courseID}/assignments`, {
    name,
    mandatory,
    startDate,
    endDate,
  });
}

async function updateAssignment(
  courseID: string,
  sectionID: string,
  day?: Day,
  startTime?: Date,
  endTime?: Date,
  location?: string,
  capacity?: string
): Promise<string> {
  return APIClient.patch(`/courses/${courseID}/assignments/${sectionID}`, {
    day,
    startTime,
    endTime,
    location,
    capacity,
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
