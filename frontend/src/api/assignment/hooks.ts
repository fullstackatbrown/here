import { Assignment } from "model/assignment";
import { collection, doc, getFirestore, onSnapshot, query, where } from "@firebase/firestore";
import { useState, useEffect } from "react";
import { FirestoreAssignmentsCollection, FirestoreCoursesCollection } from "api/firebaseConst";

export function useAssignments(courseID: string): [Assignment[] | undefined, boolean] {
    const [loading, setLoading] = useState(true);
    const [assignments, setAssignments] = useState<Assignment[] | undefined>(undefined);

    useEffect(() => {
        const db = getFirestore();
        const unsubscribe = onSnapshot(collection(db, FirestoreCoursesCollection, courseID, FirestoreAssignmentsCollection), (querySnapshot) => {
            const res: Assignment[] = [];
            querySnapshot.forEach((doc) => {
                res.push({ ID: doc.id, ...doc.data() } as Assignment);
            });
            setAssignments(res);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [courseID]);

    // Uncomment this for testing
    // return [dummyAssignments, false];
    return [assignments, loading];
}

export function useAssignmentsMap(courseID: string): [Record<string, Assignment> | undefined, boolean] {
    const [loading, setLoading] = useState(true);
    const [assignments, setAssignments] = useState<Record<string, Assignment> | undefined>(undefined);

    useEffect(() => {
        const db = getFirestore();
        const unsubscribe = onSnapshot(collection(db, FirestoreCoursesCollection, courseID, FirestoreAssignmentsCollection), (querySnapshot) => {
            const res: Record<string, Assignment> = {};
            querySnapshot.forEach((doc) => {
                res[doc.id] = { ID: doc.id, ...doc.data() } as Assignment;
            });
            setAssignments(res);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [courseID]);

    return [assignments, loading];
}