export interface Survey {
  id: string;
  courseId: string;
  name: string;
  capacity: Record<string, number>;
  responses: Record<string, string[]>;
  numResponses: number;
}
