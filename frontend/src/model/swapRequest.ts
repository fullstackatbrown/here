export type SwapRequestStatus =
  | "pending"
  | "cancelled"
  | "approved"
  | "denied"
  | "archived";

export interface SwapRequest {
  ID: string;
  studentID: string;
  oldSectionID: string;
  newSectionID: string;
  requestTime: string;
  reason: string;
  status: SwapRequestStatus;
  handledBy: string;
  assignmentID?: string;
}
