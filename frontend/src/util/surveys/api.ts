import APIClient from "@util/APIClient";
import { Survey } from "model/survey";

async function getSurveyByID(
  courseID: string,
  surveyID: string
): Promise<Survey> {
  return APIClient.get(`/courses/${courseID}/surveys/${surveyID}`);
}

async function createSurvey(courseID: string, name: string, description: string): Promise<string> {
  return APIClient.post(`/courses/${courseID}/surveys`, {
    name, description
  });
}

async function publishSurvey(
  courseID: string,
  surveyID: string
): Promise<boolean> {
  return APIClient.post(`/courses/${courseID}/surveys/${surveyID}/publish`);
}

async function createSurveyResponse(
  courseID: string,
  surveyID: string,
  times: string[]
): Promise<string> {
  return APIClient.post(`/courses/${courseID}/surveys/${surveyID}/responses`);
}

async function editSurveyResponse(
  courseID: string,
  surveyID: string,
  responseID: string,
  times: string[]
): Promise<boolean> {
  return APIClient.patch(
    `/courses/${courseID}/surveys/${surveyID}/responses/${responseID}`
  );
}

const SurveyAPI = {
  getSurveyByID,
  createSurvey,
  publishSurvey,
  createSurveyResponse,
  editSurveyResponse,
};

export default SurveyAPI;
