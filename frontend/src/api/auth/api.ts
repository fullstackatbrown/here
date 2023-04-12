import APIClient from "api/APIClient";
import { User } from "model/user";

const enum Endpoint {
    ME = '/users/me',
    USER = '/users',
}

/**
 * Fetches profile information corresponding to the currently logged in user.
 */
async function getCurrentUser(): Promise<User> {
    try {
        return await APIClient.get(Endpoint.ME);
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

async function joinCourse(entryCode: string): Promise<string> {
    try {
        return await APIClient.patch(`${Endpoint.USER}/joinCourse`, { entryCode });
    } catch (e) {
        throw e;
    }
}

async function quitCourse(courseID: string): Promise<string> {
    try {
        return await APIClient.patch(`${Endpoint.USER}/quitCourse`, { courseID });
    } catch (e) {
        throw e;
    }
}


const AuthAPI = {
    getCurrentUser,
    getUserById,
    joinCourse,
    quitCourse,
};

export default AuthAPI;