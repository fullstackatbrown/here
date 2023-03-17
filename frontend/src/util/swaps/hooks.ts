import { SwapRequest } from "model/swapRequest";

export const dummySwapRequest1: SwapRequest = {
  ID: "swap-request-1",
  studentID: "unnamed student #667",
  oldSectionID: "section1",
  newSectionID: "section2",
  isTemporary: true,
  requestTime: new Date(2022, 0, 12),
  reason: "I screen shotted classmate's NFT and now he's out to get me",
  status: "approved",
  handledBy: "unnamed TA #2301",
};

export const dummySwapRequest2: SwapRequest = {
  ID: "swap-request-2",
  studentID: "unnamed student #97",
  oldSectionID: "section2",
  newSectionID: "section3",
  isTemporary: true,
  requestTime: new Date(2022, 5, 27),
  reason: "I want to work in a room with windows and natural light",
  status: "denied",
  handledBy: "unnamed TA #4429",
};

export const dummySwapRequest3: SwapRequest = {
  ID: "swap-request-3",
  studentID: "unnamed student #438",
  oldSectionID: "section3",
  newSectionID: "section1",
  isTemporary: true,
  requestTime: new Date(2022, 3, 3),
  reason:
    "My phone went off last section when everything was quiet and not I'm too embarrassed to go back :(",
  status: "pending",
  handledBy: "unnamed TA #9328",
};

export function useSwapRequests(): [SwapRequest[] | undefined, boolean] {
  return [[dummySwapRequest1, dummySwapRequest2, dummySwapRequest3], false];
}
