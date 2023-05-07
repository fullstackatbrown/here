import { CourseUserData } from "./course";

export interface Survey {
  ID: string;
  courseID: string;
  name: string;
  description: string;
  endTime: string;
  options: SurveyOption[];
  responses: Record<string, string[]>;
  published: boolean;
  results: Record<string, CourseUserData[]>;
}

export interface SurveyResponse {
  name: string;
  email: string;
  availability: string[];
}

export interface SurveyOption {
  option: string,
  capacity: any
}
