import { Section } from "./section";

export interface Survey {
  ID: string;
  courseID: string;
  name: string;
  description: string;
  endTime: string;
  capacity: Record<string, Record<string, number>>;
  responses: Record<string, string[]>;
  published: boolean;
  results: Record<string, string[]>;
  resultsReadable: Record<string, string[]>;
}

export interface SurveyResponse {
  name: string;
  email: string;
  availability: string[];
}
