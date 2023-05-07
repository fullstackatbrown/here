import { KVPair } from "@util/shared/survey";
import { CourseUserData } from "./course";

export interface Survey {
  ID: string;
  courseID: string;
  name: string;
  description: string;
  endTime: string;
  options: KVPair[];
  responses: Record<string, string[]>;
  published: boolean;
  results: Record<string, CourseUserData[]>;
}

export interface SurveyResponse {
  name: string;
  email: string;
  availability: string[];
}
