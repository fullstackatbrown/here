export interface Survey {
  ID: string;
  courseID: string;
  name: string;
  capacity: Record<string, number>;
  description: string;
  responses: Record<string, string[]>;
    published: boolean;
}
