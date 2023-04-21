import { collection, collectionGroup, doc, documentId, endAt, getFirestore, onSnapshot, orderBy, query, startAt, where, getDocs } from "@firebase/firestore";
import { FirestoreCoursesCollection, FirestoreGradesCollection, FirestoreAssignmentsCollection } from "api/firebaseConst";
import { Grade } from "model/grades";
import { useEffect, useState } from "react";

// https://stackoverflow.com/questions/68049541/collectiongroupquery-but-limit-search-to-subcollections-under-a-particular-docum/68049847#68049847
// Get all grades for a student in a course
// Returns a map from assignmentID to grade
export function useGradesForStudent(courseID: string, studentID: string): [Record<string, Grade>, boolean] {
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

export function useGradesForAssignment(courseID: string, assignmentID: string): [Record<string, Grade>, boolean] {
    const [loading, setLoading] = useState(true);
    const [grades, setGrades] = useState<Record<string, Grade>>(undefined);

    useEffect(() => {
        const db = getFirestore();
        const unsubscribe = onSnapshot(collection(db,
            FirestoreCoursesCollection, courseID, FirestoreAssignmentsCollection, assignmentID, FirestoreGradesCollection), (querySnapshot) => {
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

// returns map from assignmentID to studentID to grade (one time query)
export function useAllGrades(courseID: string, assignmentIDs: string[]): Promise<Record<string, Record<string, Grade>>> {
    const db = getFirestore();
    const courseRef = doc(db, `${FirestoreCoursesCollection}/${courseID}`);
    const gradesRef = query(collectionGroup(db, FirestoreGradesCollection),
        orderBy(documentId()),
        startAt(courseRef.path),
        endAt(courseRef.path + "\uf8ff")
    );

    return new Promise<Record<string, Record<string, Grade>>>((resolve, reject) => {
        getDocs(gradesRef)
            .then((querySnapshot) => {
                let res: Record<string, Record<string, Grade>> = {};
                querySnapshot.forEach((doc) => {
                    const g = { ID: doc.id, ...doc.data() } as Grade;
                    if (assignmentIDs.includes(g.assignmentID)) {
                        if (res[g.assignmentID] === undefined) {
                            res[g.assignmentID] = {};
                        }
                        res[g.assignmentID][g.studentID] = g;
                    }
                });
                resolve(res);
            })
            .catch((error) => {
                reject(error);
            });
    });
}