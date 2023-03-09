import APIClient from "@util/APIClient";
import { Student } from "../../model/student";

async function getUser(): Promise<Student> {
  return APIClient.get(`/users`);
}

async function getUserByID(userID: string): Promise<Student> {
  return APIClient.get(`/users/${userID}`);
}

async function updateUser(userID: string): Promise<boolean> {
  return APIClient.patch(`/users/${userID}`);
}

async function updateUserCourseEnrollment(
  userID: string,
  courseID: string,
  action: "join" | "quit"
): Promise<boolean> {
  return APIClient.patch(`/users/${userID}/courses/`, { courseID, action });
}

const UserAPI = {
  getUser,
  getUserByID,
  updateUser,
  updateUserCourseEnrollment,
};

export default UserAPI;
