import { CourseUserData } from "./course";

export interface Survey {
  ID: string;
  courseID: string;
  name: string;
  description: string;
  endTime: string;
  options: Option[];
  responses: Record<string, string[]>;
  published: boolean;
  results: Record<string, CourseUserData[]>;
}

export interface SurveyResponse {
  name: string;
  email: string;
  availability: string[];
}

export interface Option {
  option: string,
  capacity: any
}
