import APIClient from "api/APIClient";
import { Day, Section } from "model/section";

async function getSections(courseID: string): Promise<Section[]> {
  return APIClient.get(`/courses/${courseID}/sections`);
}

async function getSectionByID(
  courseID: string,
  sectionID: string
): Promise<Section> {
  return APIClient.get(`/courses/${courseID}/sections/${sectionID}`);
}

async function deleteSection(
  courseID: string,
  sectionID: string
): Promise<boolean> {
  return APIClient.delete(`/courses/${courseID}/sections/${sectionID}`);
}

async function createSection(
  courseID: string,
  day: Day,
  startTime: string,
  endTime: string,
  location?: string,
  capacity?: number
): Promise<string> {
  return APIClient.post(`/courses/${courseID}/sections`, {
    day,
    startTime,
    endTime,
    location,
    capacity,
  });
}

async function updateSection(
  courseID: string,
  sectionID: string,
  day?: Day,
  startTime?: string,
  endTime?: string,
  location?: string,
  capacity?: number
): Promise<string> {
  return APIClient.patch(`/courses/${courseID}/sections/${sectionID}`, {
    day,
    startTime,
    endTime,
    location,
    capacity,
  });
}

const SectionAPI = {
  getSections,
  getSectionByID,
  deleteSection,
  createSection,
  updateSection,
};

export default SectionAPI;
