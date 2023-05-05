export const enum SwapStatus {
  Pending = "pending",
  Cancelled = "cancelled",
  Approved = "approved",
  Denied = "denied",
  Archived = "archived",
}

export interface Swap {
  ID: string;
  studentID: string;
  studentName: string;
  oldSectionID: string;
  newSectionID: string;
  requestTime: Date;
  handledTime?: Date;
  reason: string;
  status: SwapStatus;
  handledBy: string;
  assignmentID?: string;
}
