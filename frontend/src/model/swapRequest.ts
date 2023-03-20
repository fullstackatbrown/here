export interface SwapRequest {
  ID: string;
  studentID: string;
  oldSectionID: string;
  newSectionID: string;
  requestTime: Date;
  reason: string;
  status: string;
  handledBy: string;
  assignmentID?: string;
}
