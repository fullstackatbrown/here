import APIClient from "@util/APIClient";
import { User } from "model/user";

const enum Endpoint {
    USER = '/users',
}

export const enum CoursePermission {
    CourseAdmin = "ADMIN",
    CourseStaff = "STAFF"
}

export const enum ChangeCourseAction {
    Join = "JOIN",
    Quit = "QUIT"
}

/**
 * Fetches profile information corresponding to the currently logged in user.
 */
async function getCurrentUser(): Promise<User> {
    try {
        return await APIClient.get(Endpoint.USER);
    } catch (e) {
        throw e;
    }
}

/**
 * Fetches profile information corresponding to the currently logged in user.
 */
async function getUserById(id: string): Promise<User> {
    try {
        return await APIClient.get(`${Endpoint.USER}/${id}`);
    } catch (e) {
        throw e;
    }
}

/**
 * 
 * @param id 
 * @returns 
 */

async function joinOrQuitCourse(userId: string, entryCode: string, action: ChangeCourseAction): Promise<string> {
    try {
        return await APIClient.patch(`${Endpoint.USER}/${userId}/courses`, { userId, entryCode, action });
    } catch (e) {
        throw e;
    }
}

const AuthAPI = {
    getCurrentUser,
    getUserById,
    joinOrQuitCourse,
};

export default AuthAPI;