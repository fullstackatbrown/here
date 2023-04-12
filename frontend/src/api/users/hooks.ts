import { User } from "model/user";
import { useEffect, useState } from "react";
import { collection, doc, getFirestore, onSnapshot, query, where, documentId } from "@firebase/firestore";
import { FirestoreProfilesCollection } from "api/firebaseConst";
import firebase from 'firebase/app'

export function useStudentsByIDs(studentIDs: string[]): [User[], boolean] {
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState<User[] | undefined>(undefined);

    useEffect(() => {
        const db = getFirestore();
        const q = query(collection(db, FirestoreProfilesCollection), where(documentId(), "in", studentIDs));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const res: User[] = [];
            querySnapshot.forEach((doc) => {
                res.push({ ID: doc.id, ...doc.data() } as User);
            });

            setStudents(res);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [studentIDs]);

    return [students, loading];
}
