import APIClient from "api/APIClient";
import { Swap } from "model/swap";

async function createSwap(
  courseID: string,
  oldSectionID: string,
  newSectionID: string,
  assignmentID: string,
  reason: string
): Promise<string> {
  const studentID = "omlAafBhRN9Aghvgz8qG" // TODO: get studentID from auth
  return APIClient.post(`/courses/${courseID}/swaps`, {
    studentID,
    oldSectionID,
    newSectionID,
    assignmentID,
    reason,
  });
}

async function updateSwap(
  courseID: string,
  swapID: string,
  newSectionID: string,
  assignmentID: string,
  reason: string
): Promise<boolean> {
  return APIClient.patch(`/courses/${courseID}/swaps/${swapID}`, { newSectionID, assignmentID, reason });
}

async function handleSwap(
  courseID: string,
  swapID: string,
  status: string
): Promise<Swap> {
  return APIClient.patch(`/courses/${courseID}/swaps/${swapID}/handle`, { status });
}

async function cancelSwap(courseID: string, swapID: string): Promise<boolean> {
  return APIClient.patch(`/courses/${courseID}/swaps/${swapID}/cancel`);
}

const SwapAPI = {
  createSwap,
  updateSwap,
  handleSwap,
  cancelSwap,
};

export default SwapAPI;
