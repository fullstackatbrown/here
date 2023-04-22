import { collection, getFirestore, onSnapshot } from "@firebase/firestore";
import { FirestoreAssignmentsCollection, FirestoreCoursesCollection } from "api/firebaseConst";
import { Assignment } from "model/assignment";
import { useEffect, useState } from "react";

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
            console.log(res);
            setAssignments(res);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [courseID]);

    return [assignments, loading];
}