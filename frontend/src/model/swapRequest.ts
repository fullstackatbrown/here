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
  requestTime: Date;
  reason: string;
  status: SwapRequestStatus;
  handledBy: string;
  assignmentID?: string
}
