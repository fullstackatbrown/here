import { Assignment } from "model/assignment";
import { collection, doc, getFirestore, onSnapshot, query, where } from "@firebase/firestore";
import { useState, useEffect } from "react";

const dummyAssignments: Assignment[] = [
    {
        ID: "1",
        courseID: "string",
        name: "Design Thinking & Low-Fi",
        optional: false,
        releaseDate: new Date().toISOString(),
        dueDate: new Date().toISOString(),
        gradesByStudent: {},
        maxScore: 1,
    },
    {
        ID: "2",
        courseID: "string",
        name: "Hi-fi Prototype",
        optional: false,
        releaseDate: new Date().toISOString(),
        dueDate: new Date().toISOString(),
        gradesByStudent: {},
        maxScore: 1,
    },
    {
        ID: "3",
        courseID: "string",
        name: "Web Dev",
        optional: false,
        releaseDate: new Date().toISOString(),
        dueDate: new Date().toISOString(),
        gradesByStudent: {},
        maxScore: 1,
    },
    {
        ID: "4",
        courseID: "string",
        name: "Flutter",
        optional: true,
        releaseDate: new Date().toISOString(),
        dueDate: new Date().toISOString(),
        gradesByStudent: {},
        maxScore: 2,
    },
]

export function useAssignments(courseID: string): [Assignment[] | undefined, boolean] {
    const [loading, setLoading] = useState(true);
    const [assignments, setAssignments] = useState<Assignment[] | undefined>(undefined);

    useEffect(() => {
        const db = getFirestore();
        const q = query(collection(db, "assignments"), where("courseID", "==", courseID));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const res: Assignment[] = [];
            querySnapshot.forEach((doc) => {
                res.push({ ID: doc.id, ...doc.data() } as Assignment);
            });
            setAssignments(res);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Uncomment this for testing
    // return [dummyAssignments, false];
    return [assignments, loading];
}