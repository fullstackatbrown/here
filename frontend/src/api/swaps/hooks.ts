import { collection, getFirestore, onSnapshot, query, where } from "@firebase/firestore";
import { FirestoreCoursesCollection, FirestoreSwapsCollection } from "api/firebaseConst";
import { Swap } from "model/swap";
import { useEffect, useState } from "react";

export function usePendingSwaps(courseID: string, studentID: string = undefined): [Swap[] | undefined, boolean] {
  const [loading, setLoading] = useState(true);
  const [swaps, setSections] = useState<Swap[] | undefined>(undefined);

  let queryConstraints = [where("status", "==", "pending")];
  if (studentID) queryConstraints.push(where("studentID", "==", studentID));

  useEffect(() => {
    const db = getFirestore();
    const unsubscribe = onSnapshot(query(collection(db, FirestoreCoursesCollection,
      courseID, FirestoreSwapsCollection), ...queryConstraints), (querySnapshot) => {
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

export function usePastSwaps(courseID: string, studentID: string = undefined): [Swap[] | undefined, boolean] {
  const [loading, setLoading] = useState(true);
  const [swaps, setSections] = useState<Swap[] | undefined>(undefined);

  let queryConstraints = [where("status", "!=", "pending")];
  if (studentID) queryConstraints.push(where("studentID", "==", studentID));

  useEffect(() => {
    const db = getFirestore();
    const unsubscribe = onSnapshot(query(collection(db, FirestoreCoursesCollection,
      courseID, FirestoreSwapsCollection), ...queryConstraints), (querySnapshot) => {
        const res: Swap[] = [];
        querySnapshot.forEach((doc) => {
          res.push({ ID: doc.id, ...doc.data() } as Swap);
        });

        setSections(res);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [courseID]);

  return [swaps, loading];
}

export function useSwapsByStudent(courseID: string, studentID: string): [Swap[] | undefined, boolean] {
  const [loading, setLoading] = useState(true);
  const [swaps, setSections] = useState<Swap[] | undefined>(undefined);

  useEffect(() => {
    const db = getFirestore();
    const unsubscribe = onSnapshot(query(collection(db, FirestoreCoursesCollection,
      courseID, FirestoreSwapsCollection), where("studentID", "==", studentID)), (querySnapshot) => {
        const res: Swap[] = [];
        querySnapshot.forEach((doc) => {
          res.push({ ID: doc.id, ...doc.data() } as Swap);
        });

        setSections(res);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [courseID]);

  return [swaps, loading];
}

