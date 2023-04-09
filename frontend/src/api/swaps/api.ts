import APIClient from "api/APIClient";
import { Swap } from "model/swap";

async function createSwap(
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

async function updateSwap(
  courseID: string,
  swapID: string,
  status: boolean
): Promise<boolean> {
  return APIClient.patch(`/courses/${courseID}/swaps/${swapID}`, { status });
}

async function handleSwap(
  courseID: string,
  swapID: string,
  status: string,
  handledBy: string
): Promise<Swap> {
  return APIClient.patch(`/courses/${courseID}/swaps/${swapID}/handle`, { status, handledBy });
}

const SwapAPI = {
  createSwap,
  updateSwap,
  handleSwap,
};

export default SwapAPI;
