export interface SwapRequest {
  ID: string;
  studentID: string;
  oldSectionID: string;
  newSectionID: string;
  isTemporary: boolean;
  requestTime: Date;
  reason: string;
  status: string;
  handledBy: string;
}
