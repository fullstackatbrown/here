import APIClient from "api/APIClient";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import { User } from "model/user";

const enum Endpoint {
    ME = '/users/me',
    USER = '/users',
    GET_SESSION = '/users/session',
    AUTHORIZE_GAPI = '/users/authorizeGapi',
    EDIT_ADMIN_ACCESS = '/users/editAdminAccess',
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

async function authorizeGcal(currentUrl: string) {
    var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

    // Create <form> element to submit parameters to OAuth 2.0 endpoint.
    var form = document.createElement('form');
    form.setAttribute('method', 'GET'); // Send as a GET request.
    form.setAttribute('action', oauth2Endpoint);

    // Parameters to pass to OAuth 2.0 endpoint.
    var params = {
        'client_id': process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        'redirect_uri': 'http://localhost:8080/users/authorizeGapi/callback',
        'response_type': 'code',
        'scope': 'https://www.googleapis.com/auth/drive.metadata.readonly',
        'include_granted_scopes': 'true',
        'state': currentUrl,
        'access_type': 'offline',
    };

    // Add form parameters as hidden input values.
    for (var p in params) {
        var input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]);
        form.appendChild(input);
    }

    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
}

async function editAdminAccess(email: string, isAdmin: boolean): Promise<string> {
    try {
        return await APIClient.patch(`${Endpoint.EDIT_ADMIN_ACCESS}`, { email, isAdmin });
    } catch (e) {
        throw e;
    }
}

async function clearNotification(notificationID: string): Promise<string> {
    try {
        return await APIClient.delete(`${Endpoint.USER}/notifications/${notificationID}`);
    } catch (e) {
        throw e;
    }
}

async function clearAllNotifications(): Promise<string> {
    try {
        return await APIClient.delete(`${Endpoint.USER}/notifications`);
    } catch (e) {
        throw e;
    }
}

async function signOut() {
    try {
        return await APIClient.post(`${Endpoint.USER}/signout`);
    } catch (e) {
        throw e;
    }
}

const AuthAPI = {
    getCurrentUser,
    getUserById,
    joinCourse,
    quitCourse,
    signInWithGoogle,
    authorizeGcal,
    editAdminAccess,
    clearNotification,
    clearAllNotifications,
    signOut,
};

export default AuthAPI;