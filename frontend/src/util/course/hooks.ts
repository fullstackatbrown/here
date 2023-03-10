import { useEffect, useState } from "react";
import { collection, doc, getFirestore, onSnapshot } from "@firebase/firestore";
import AuthAPI, { User } from "@util/auth/api";
import { Course } from "model/course";

const dummyCourse: Course = {
    ID: "",
    title: "Deep Learning",
    code: "CSCI 1470",
    term: "spring 2023",
    sectionIDs: [],
    students: { "student1": "", "student2": "", "student3": "", "student4": "" },
    surveyID: "survey1",
};

const dummyCourses: Course[] = [dummyCourse]


export function useCourses(): [Course[] | undefined, boolean] {
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState<Course[] | undefined>(undefined);


    // TODO: make call to backend to get courses
    // useEffect(() => {
    //     const db = getFirestore();
    //     const unsubscribe = onSnapshot(collection(db, "courses"), (querySnapshot) => {
    //         const res: Course[] = [];
    //         querySnapshot.forEach((doc) => {
    //             res.push({id: doc.id, ...doc.data()} as Course);
    //         });

    //         setCourses(res);
    //         setLoading(false);
    //     });

    //     return () => unsubscribe();
    // }, []);

    // return [courses, loading];

    return [dummyCourses, false];
}

export function useCourse(courseID: string): [Course | undefined, boolean] {
    return [dummyCourse, false];
}

export function useCourseStaff(courseID: string): [User[], boolean] {
    const [loading, setLoading] = useState(true);
    const [staff, setStaff] = useState<User[]>([]);

    useEffect(() => {
        if (courseID) {
            const db = getFirestore();
            const unsubscribe = onSnapshot(doc(db, "courses", courseID), (doc) => {
                const data = doc.data();
                if (data) {
                    const staffIDs = Object.keys(data.coursePermissions);
                    Promise.all(staffIDs.map(staffID => AuthAPI.getUserById(staffID)))
                        .then(res => {
                            setStaff(res);
                            setLoading(false);
                        });
                }
            });

            return () => unsubscribe();
        }
    }, [courseID]);

    return [staff, loading];
}

export function useInvitations(courseID: string): [string[], boolean] {
    const [loading, setLoading] = useState(true);
    const [invites, setInvites] = useState<string[]>([]);

    useEffect(() => {
        const db = getFirestore();
        const unsubscribe = onSnapshot(collection(db, "invites"), (querySnapshot) => {
            const res: string[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.courseID === courseID) res.push(data.email);
            });

            setInvites(res);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [courseID]);

    return [invites, loading];
}