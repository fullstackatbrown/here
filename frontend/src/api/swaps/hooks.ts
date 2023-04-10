import { collection, getFirestore, onSnapshot, query, where } from "@firebase/firestore";
import { FirestoreCoursesCollection, FirestoreSwapsCollection } from "api/firebaseConst";
import { Swap } from "model/swap";
import { useEffect, useState } from "react";

export function usePendingSwaps(courseID: string): [Swap[] | undefined, boolean] {
  const [loading, setLoading] = useState(true);
  const [swaps, setSections] = useState<Swap[] | undefined>(undefined);

  useEffect(() => {
    const db = getFirestore();
    const unsubscribe = onSnapshot(query(collection(db, FirestoreCoursesCollection,
      courseID, FirestoreSwapsCollection), where("status", "==", "pending")), (querySnapshot) => {
        const res: Swap[] = [];
        querySnapshot.forEach((doc) => {
          res.push({ ID: doc.id, ...doc.data() } as Swap);
        });

        setSections(res);
        setLoading(false);
      });

    return () => unsubscribe();
  }, [courseID]);

  return [swaps, loading];
}

export function usePastSwaps(courseID: string): [Swap[] | undefined, boolean] {
  const [loading, setLoading] = useState(true);
  const [swaps, setSections] = useState<Swap[] | undefined>(undefined);

  useEffect(() => {
    const db = getFirestore();
    const unsubscribe = onSnapshot(query(collection(db, FirestoreCoursesCollection,
      courseID, FirestoreSwapsCollection), where("status", "!=", "pending")), (querySnapshot) => {
        const res: Swap[] = [];
        querySnapshot.forEach((doc) => {
          res.push({ ID: doc.id, ...doc.data() } as Swap);
        });

        setSections(res);
        setLoading(false);
      });

    return () => unsubscribe();
  }, [courseID]);

  return [swaps, loading];
}