import { CourseUserData } from "model/course"
import { User } from "model/user";

interface UserData {
    displayName: string;
    email: string;
}

export const filterStudentsBySearchQuery = (students: CourseUserData[], searchQuery: string): CourseUserData[] => {
    // return students whose display name or email contains the search query
    return students.filter((student) => {
        const matchesDisplayName = student.displayName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesEmail = student.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesDisplayName || matchesEmail;
    })
}

export const sortByName = (users: UserData[]) => {
    return users.sort((a, b) => {
        if (a.displayName < b.displayName) return -1;
        if (a.displayName > b.displayName) return 1;
        return 0;
    })
}

export interface UserOrInvite {
    user?: User;
    email?: string;
}

// put all users first, then all emails
// for users, sort by displayName
// for emails, sort by email
export const sortUsersOrInvites = (usersOrInvites: UserOrInvite[]) => {
    return usersOrInvites.sort((a, b) => {
        if (a.user && b.user) {
            if (a.user.displayName < b.user.displayName) return -1;
            if (a.user.displayName > b.user.displayName) return 1;
            return 0;
        } else if (a.user && b.email) {
            return -1;
        } else if (a.email && b.user) {
            return 1;
        } else {
            if (a.email < b.email) return -1;
            if (a.email > b.email) return 1;
            return 0;
        }
    })
}