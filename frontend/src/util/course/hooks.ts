import { useEffect, useState } from "react";
import { collection, doc, getFirestore, onSnapshot } from "@firebase/firestore";
import AuthAPI, { User } from "@util/auth/api";
import { Course } from "model/course";

const dummyCourse1: Course = {
    ID: "",
    title: "Deep Learning",
    code: "CSCI 1470",
    term: "Spring 2023",
    sectionIDs: [],
    students: { "student1": "", "student2": "", "student3": "", "student4": "" },
    surveyID: "survey1",
    assignmentIDs: [],
    swapRequests: [],
};

const dummyCourse2: Course = {
    ID: "",
    title: "Computer Graphics",
    code: "CSCI 1270",
    term: "Fall 2022",
    sectionIDs: [],
    students: { "student1": "", "student2": "", "student3": "", "student4": "" },
    surveyID: "survey1",
    assignmentIDs: [],
    swapRequests: [],
};

const dummyCourse3: Course = {
    ID: "",
    title: "User Interface and User Experience",
    code: "CSCI 1300",
    term: "Fall 2022",
    sectionIDs: [],
    students: { "student1": "", "student2": "", "student3": "", "student4": "" },
    surveyID: "survey1",
    assignmentIDs: [],
    swapRequests: [],
};

const dummyCourses: Course[] = [dummyCourse1, dummyCourse2, dummyCourse3];

export function useCourses(): [Course[] | undefined, boolean] {
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState<Course[] | undefined>(undefined);

    useEffect(() => {
        const db = getFirestore();
        const unsubscribe = onSnapshot(collection(db, "courses"), (querySnapshot) => {
            const res: Course[] = [];
            querySnapshot.forEach((doc) => {
                console.log(doc.id)
                res.push({ ID: doc.id, ...doc.data() } as Course);
            });

            setCourses(res);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Uncomment this for testing
    // return [dummyCourses, false];
    return [courses, loading];
}

export function useCourse(courseID: string): [Course | undefined, boolean] {
    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState<Course | undefined>(undefined);

    useEffect(() => {
        if (courseID) {
            const db = getFirestore();
            const unsubscribe = onSnapshot(doc(db, "courses", courseID), (doc) => {
                if (doc.exists()) {
                    setCourse({ ID: doc.id, ...doc.data() } as Course);

                }
                setLoading(false);
            });
            return () => unsubscribe();
        }
    }, [courseID]);

    return [course, loading];

    // Uncomment this for testing
    // return [dummyCourse1, false];
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