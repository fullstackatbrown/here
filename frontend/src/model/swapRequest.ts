export interface SwapRequest {
  id: string;
  studentId: string;
  oldSectionId: string;
  newSectionId: string;
  isTemporary: boolean;
  requestTime: Date;
  reason: string;
  approved: boolean;
  handledBy: string;
}
