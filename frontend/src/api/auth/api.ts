import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import APIClient from "api/APIClient";
import { User } from "model/user";

const enum Endpoint {
    ME = '/users/me',
    USER = '/users',
    GET_SESSION = '/users/session',
}

async function getCurrentUser(): Promise<User> {
    try {
        return await APIClient.get(Endpoint.ME);
    } catch (e) {
        throw e;
    }
}

async function getUserById(id: string): Promise<User> {
    try {
        return await APIClient.get(`${Endpoint.USER}/${id}`);
    } catch (e) {
        throw e;
    }
}

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

/**
 * Redirects the user to a Google sign in page, then creates a session with the SMU API.
 */
async function signInWithGoogle() {
    const auth = getAuth();

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
        'hd': 'brown.edu'
    });

    return signInWithPopup(auth, provider)
        .then((userCredential) => {
            // Signed in
            return userCredential.user.getIdToken(true)
                .then((idToken) => {
                    // Session login endpoint is queried and the session cookie is set.
                    // TODO: CSRF protection should be taken into account.
                    return APIClient.post(Endpoint.GET_SESSION, { token: idToken.toString() });
                });
        })
        .catch(() => {
            throw Error("Invalid credentials");
        });
}


const AuthAPI = {
    getCurrentUser,
    getUserById,
    joinCourse,
    quitCourse,
    signInWithGoogle
};

export default AuthAPI;