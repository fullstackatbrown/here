import { collectionGroup, doc, documentId, endAt, getFirestore, onSnapshot, orderBy, query, startAt, where } from "@firebase/firestore";
import { FirestoreCoursesCollection, FirestoreGradesCollection } from "api/firebaseConst";
import { Grade } from "model/grades";
import { useEffect, useState } from "react";

// https://stackoverflow.com/questions/68049541/collectiongroupquery-but-limit-search-to-subcollections-under-a-particular-docum/68049847#68049847
// Get all grades for a student in a course
// Returns a map from assignmentID to grade
export function useGrades(courseID: string, studentID: string): [Record<string, Grade>, boolean] {
    const [loading, setLoading] = useState(true);
    const [grades, setGrades] = useState<Record<string, Grade>>(undefined);

    useEffect(() => {
        const db = getFirestore();
        const courseRef = doc(db, `${FirestoreCoursesCollection}/${courseID}`);
        const unsubscribe = onSnapshot(
            query(collectionGroup(db, FirestoreGradesCollection),
                where("studentID", "==", studentID),
                orderBy(documentId()),
                startAt(courseRef.path),
                endAt(courseRef.path + "\uf8ff")
            ),
            (querySnapshot) => {
                const res: Record<string, Grade> = {};
                querySnapshot.forEach((doc) => {
                    const g = { ID: doc.id, ...doc.data() } as Grade;
                    res[g.assignmentID] = g;
                });
                setGrades(res);
                setLoading(false);
            })
        return () => unsubscribe();
    }, [courseID, studentID]);

    return [grades, loading];
}
// export function useGrades(courseID: string, assignmentID: string): [Record<string, Grade>, boolean] {
//     const [loading, setLoading] = useState(true);
//     const [grades, setGrades] = useState<Record<string, Grade>>(undefined);

//     useEffect(() => {
//         const db = getFirestore();
//         const unsubscribe = onSnapshot(collection(db,
//             FirestoreCoursesCollection, courseID, FirestoreAssignmentsCollection, assignmentID, FirestoreGradessCollection), (querySnapshot) => {
//                 const res: Record<string, Grade> = {};
//                 querySnapshot.forEach((doc) => {
//                     const g = { ID: doc.id, ...doc.data() } as Grade;
//                     res[g.studentID] = g;
//                 });
//                 setGrades(res);
//                 setLoading(false);
//             });
//         return () => unsubscribe();
//     }, [courseID, assignmentID]);

//     return [grades, loading];
// }
