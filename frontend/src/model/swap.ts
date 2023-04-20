export type SwapStatus =
  | "pending"
  | "cancelled"
  | "approved"
  | "denied"
  | "archived";

export interface Swap {
  ID: string;
  studentID: string;
  studentName: string;
  oldSectionID: string;
  newSectionID: string;
  requestTime: Date;
  reason: string;
  status: SwapStatus;
  handledBy: string;
  assignmentID?: string;
}
