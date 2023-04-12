import { useEffect, useState } from "react";
import { collection, doc, getFirestore, onSnapshot, query, where, documentId } from "@firebase/firestore";
import AuthAPI from "api/auth/api";
import { Course } from "model/course";
import { FirestoreCoursesCollection } from "api/firebaseConst";

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

export function useCoursesByIDsByTerm(ids: string[]): [Record<string, Course[]> | undefined, boolean] {
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
                        if (!res[doc.data().term]) {
                            res[doc.data().term] = [];
                        }
                        res[doc.data().term].push({ ID: doc.id, ...doc.data() } as Course);
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