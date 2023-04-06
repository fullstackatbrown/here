import { Grade } from "model/grades";
import { useEffect, useState } from "react";
import { collection, doc, getFirestore, onSnapshot, query, where } from "@firebase/firestore";
import { FirestoreAssignmentsCollection, FirestoreCoursesCollection, FirestoreGradessCollection } from "api/firebaseConst";
import listToMap from "@util/shared/listToMap";

export function useGrades(courseID: string, assignmentID: string): [Record<string, Grade>, boolean] {
    const [loading, setLoading] = useState(true);
    const [grades, setGrades] = useState<Record<string, Grade>>(undefined);

    useEffect(() => {
        const db = getFirestore();
        const unsubscribe = onSnapshot(collection(db,
            FirestoreCoursesCollection, courseID, FirestoreAssignmentsCollection, assignmentID, FirestoreGradessCollection), (querySnapshot) => {
                const res: Record<string, Grade> = {};
                querySnapshot.forEach((doc) => {
                    const g = { ID: doc.id, ...doc.data() } as Grade;
                    res[g.studentID] = g;
                });
                setGrades(res);
                setLoading(false);
            });
        return () => unsubscribe();
    }, [courseID, assignmentID]);

    return [grades, loading];
}
