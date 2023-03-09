import APIClient from "@util/APIClient";
import { SwapRequest } from "model/swapRequest";

async function createSwapRequest(
  courseID: string,
  studentID: string,
  oldSectionID: string,
  toSectionID: string,
  isTemporary: boolean,
  reason: string
): Promise<string> {
  return APIClient.post(`/courses/${courseID}/swaps`, {
    studentID,
    oldSectionID,
    toSectionID,
    isTemporary,
    reason,
  });
}

async function updateSwapRequest(
  courseID: string,
  swapID: string,
  status: boolean
): Promise<boolean> {
  return APIClient.patch(`/courses/${courseID}/swaps/${swapID}`, { status });
}

async function getSwaps(courseID: string): Promise<SwapRequest[]> {
  return APIClient.get(`/courses/${courseID}/swaps`);
}

async function getSwapByStudent(courseID: string): Promise<SwapRequest> {
  return APIClient.get(`/courses/${courseID}/me`);
}

const SwapRequestAPI = {
  createSwapRequest,
  updateSwapRequest,
  getSwaps,
  getSwapByStudent,
};

export default SwapRequestAPI;
