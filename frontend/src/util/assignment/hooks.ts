import { Assignment } from "model/assignment";
import { collection, doc, getFirestore, onSnapshot } from "@firebase/firestore";
import { useState, useEffect } from "react";

const dummyAssignments: Assignment[] = [
    {
        ID: "1",
        courseID: "string",
        name: "Design Thinking & Low-Fi",
        optional: false,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        gradesByStudent: {},
        maxScore: 1,
    },
    {
        ID: "2",
        courseID: "string",
        name: "Hi-fi Prototype",
        optional: false,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        gradesByStudent: {},
        maxScore: 1,
    },
    {
        ID: "3",
        courseID: "string",
        name: "Web Dev",
        optional: false,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        gradesByStudent: {},
        maxScore: 1,
    },
    {
        ID: "4",
        courseID: "string",
        name: "Flutter",
        optional: true,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        gradesByStudent: {},
        maxScore: 2,
    },
]

export function useAssignments(courseID: string): [Assignment[] | undefined, boolean] {
    const [loading, setLoading] = useState(true);
    const [assignments, setAssignments] = useState<Assignment[] | undefined>(undefined);

    // useEffect(() => {
    //     const db = getFirestore();
    //     const unsubscribe = onSnapshot(collection(db, "assignments"), (querySnapshot) => {
    //         const res: Assignment[] = [];
    //         querySnapshot.forEach((doc) => {
    //             res.push({ ID: doc.id, ...doc.data() } as Assignment);
    //         });

    //         setAssignments(res);
    //         setLoading(false);
    //     });

    //     return () => unsubscribe();
    // }, []);

    // Uncomment this for testing
    // return [[], false];
    return [dummyAssignments, false];
    // return [assignments, loading];
}