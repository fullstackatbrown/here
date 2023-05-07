import APIClient from "api/APIClient";
import { Option } from "model/survey";

async function createSurvey(courseID: string, name: string, description: string, endTime: string, options: Option[]): Promise<string> {
  return APIClient.post(`/courses/${courseID}/surveys`, {
    name, description, endTime, options
  });
}

async function updateSurvey(courseID: string, surveyID: string, name: string, description: string, endTime: string, options: Option[]): Promise<string> {
  return APIClient.patch(`/courses/${courseID}/surveys/${surveyID}`, {
    name, description, endTime, options
  });
}
async function publishSurvey(
  courseID: string,
  surveyID: string
): Promise<boolean> {
  return APIClient.post(`/courses/${courseID}/surveys/${surveyID}/publish`);
}

async function deleteSurvey(
  courseID: string,
  surveyID: string
): Promise<boolean> {
  return APIClient.delete(`/courses/${courseID}/surveys/${surveyID}`);
}

async function generateResults(
  courseID: string,
  surveyID: string
): Promise<any> {
  return APIClient.post(`/courses/${courseID}/surveys/${surveyID}/results`);
}

async function applyResults(
  courseID: string,
  surveyID: string
): Promise<boolean> {
  return APIClient.post(`/courses/${courseID}/surveys/${surveyID}/results/apply`);
}

async function createSurveyResponse(
  courseID: string,
  surveyID: string,
  availability: string[]
): Promise<string> {
  return APIClient.post(`/courses/${courseID}/surveys/${surveyID}/responses`, { availability });
}

async function editSurveyResponse(
  courseID: string,
  surveyID: string,
  responseID: string,
  availability: string[]
): Promise<boolean> {
  return APIClient.patch(
    `/courses/${courseID}/surveys/${surveyID}/responses/${responseID}`, { availability }
  );
}

async function getSurveyResponses(
  courseID: string,
  surveyID: string
): Promise<any> {
  return APIClient.get(`/courses/${courseID}/surveys/${surveyID}/responses`);
}

const SurveyAPI = {
  createSurvey,
  updateSurvey,
  publishSurvey,
  deleteSurvey,
  generateResults,
  applyResults,
  createSurveyResponse,
  editSurveyResponse,
  getSurveyResponses,
};

export default SurveyAPI;
