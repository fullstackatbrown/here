import { useEffect, useState } from "react";
import { collection, doc, getFirestore, onSnapshot, query, where, documentId } from "@firebase/firestore";
import AuthAPI from "api/auth/api";
import { Course, CourseStatus } from "model/course";
import { FirestoreCoursesCollection } from "api/firebaseConst";
import { CoursePermission, User } from "model/user";

export function useCourses(): [Course[] | undefined, boolean] {
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState<Course[] | undefined>(undefined);

    useEffect(() => {
        const db = getFirestore();
        const unsubscribe = onSnapshot(collection(db, FirestoreCoursesCollection), (querySnapshot) => {
            const res: Course[] = [];
            querySnapshot.forEach((doc) => {
                res.push({ ID: doc.id, ...doc.data() } as Course);
            });

            setCourses(res);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return [courses, loading];
}

export function useCoursesByIDs(ids: string[]): [Course[] | undefined, boolean] {
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState<Course[] | undefined>(undefined);

    useEffect(() => {
        if (ids && ids.length > 0) {
            const db = getFirestore();
            const unsubscribe = onSnapshot(
                query(collection(db, FirestoreCoursesCollection),
                    where(documentId(), "in", ids)
                ),
                (querySnapshot) => {
                    const res: Course[] = [];
                    querySnapshot.forEach((doc) => {
                        res.push({ ID: doc.id, ...doc.data() } as Course);
                    });

                    setCourses(res);
                    setLoading(false);
                });

            return () => unsubscribe();
        } else {
            setLoading(false);
        }
    }, [ids]);

    return [courses, loading];
}

export function useCoursesByTerm(): [Record<string, Course[]> | undefined, boolean] {
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState<Record<string, Course[]> | undefined>(undefined);

    useEffect(() => {
        const db = getFirestore();
        const unsubscribe = onSnapshot(collection(db, FirestoreCoursesCollection), (querySnapshot) => {
            const res: Record<string, Course[]> = {};
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (!res[data.term]) {
                    res[data.term] = [];
                }
                res[data.term].push({ ID: doc.id, ...doc.data() } as Course);
            });

            setCourses(res);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return [courses, loading];
}


// Only courses that are active or archived
export function useCoursesByIDsTerm(ids: string[]): [Record<string, Course[]> | undefined, boolean] {
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState<Record<string, Course[]> | undefined>(undefined);

    useEffect(() => {
        if (ids.length > 0) {
            const db = getFirestore();
            const unsubscribe = onSnapshot(
                query(collection(db, FirestoreCoursesCollection),
                    where(documentId(), "in", ids)
                ),
                (querySnapshot) => {
                    const res: Record<string, Course[]> = {};
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        if (data.status !== CourseStatus.CourseInactive) {
                            if (!res[data.term]) {
                                res[data.term] = [];
                            }
                            res[data.term].push({ ID: doc.id, ...doc.data() } as Course);
                        }
                    });

                    setCourses(res);
                    setLoading(false);
                });

            return () => unsubscribe();
        } else {
            setLoading(false);
        }
    }, [ids]);

    return [courses, loading];
}

export function useCourse(courseID: string): [Course | undefined, boolean] {
    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState<Course | undefined>(undefined);

    useEffect(() => {
        if (courseID) {
            const db = getFirestore();
            const unsubscribe = onSnapshot(doc(db, FirestoreCoursesCollection, courseID), (doc) => {
                if (doc.exists()) {
                    setCourse({ ID: doc.id, ...doc.data() } as Course);
                }
                setLoading(false);
            });
            return () => unsubscribe();
        }
    }, [courseID]);

    return [course, loading];
}

export function useCourseStaff(courseID: string, access: CoursePermission): [User[], boolean] {
    const [loading, setLoading] = useState(true);
    const [staff, setStaff] = useState<User[]>([]);

    useEffect(() => {
        if (courseID) {
            const db = getFirestore();
            const unsubscribe = onSnapshot(doc(db, FirestoreCoursesCollection, courseID), (doc) => {
                const data = doc.data();
                if (data?.permissions) {
                    const uids = Object.keys(data.permissions).filter((id) => data.permissions[id] === access);

                    Promise.all(uids.map(uid => AuthAPI.getUserById(uid)))
                        .then(res => {
                            setStaff(res);
                            setLoading(false);
                        });
                } else {
                    setLoading(false);
                }
            });

            return () => unsubscribe();
        }
    }, [courseID]);

    return [staff, loading];
}