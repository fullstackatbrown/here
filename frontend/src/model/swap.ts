export type SwapStatus =
  | "pending"
  | "cancelled"
  | "approved"
  | "denied"
  | "archived";

export interface Swap {
  ID: string;
  studentID: string;
  oldSectionID: string;
  newSectionID: string;
  requestTime: string;
  reason: string;
  status: SwapStatus;
  handledBy: string;
  assignmentID?: string;
}
