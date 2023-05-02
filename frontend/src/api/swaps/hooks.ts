import { collection, getFirestore, onSnapshot, query, where } from "@firebase/firestore";
import { FirestoreCoursesCollection, FirestoreSwapsCollection } from "api/firebaseConst";
import { Swap } from "model/swap";
import { useEffect, useMemo, useState } from "react";

export function usePendingSwaps(courseID: string, studentID: string = undefined): [Swap[] | undefined, boolean] {
  const [loading, setLoading] = useState(true);
  const [swaps, setSections] = useState<Swap[] | undefined>(undefined);

  const queryConstraints = useMemo(() => [
    where("status", "==", "pending"),
    studentID ? where("studentID", "==", studentID) : null,
  ].filter(Boolean), [studentID]);

  useEffect(() => {
    const db = getFirestore();
    const unsubscribe = onSnapshot(query(collection(db, FirestoreCoursesCollection,
      courseID, FirestoreSwapsCollection), ...queryConstraints), (querySnapshot) => {
        const res: Swap[] = [];
        querySnapshot.forEach((doc) => {
          res.push({ ID: doc.id, ...doc.data(), requestTime: doc.get("requestTime").toDate() } as Swap);
        });

        setSections(res);
        setLoading(false);
      });

    return () => unsubscribe();
  }, [courseID, queryConstraints]);

  return [swaps, loading];
}

export function usePastSwaps(courseID: string, studentID: string = undefined): [Swap[] | undefined, boolean] {
  const [loading, setLoading] = useState(true);
  const [swaps, setSections] = useState<Swap[] | undefined>(undefined);

  const queryConstraints = useMemo(() => [
    where("status", "!=", "pending"),
    studentID ? where("studentID", "==", studentID) : null,
  ].filter(Boolean), [studentID]);

  useEffect(() => {
    const db = getFirestore();
    const unsubscribe = onSnapshot(query(collection(db, FirestoreCoursesCollection,
      courseID, FirestoreSwapsCollection), ...queryConstraints), (querySnapshot) => {
        const res: Swap[] = [];
        querySnapshot.forEach((doc) => {
          res.push({ ID: doc.id, ...doc.data(), requestTime: doc.get("requestTime").toDate() } as Swap);
        });

        setSections(res);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [courseID, queryConstraints]);

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
          res.push({ ID: doc.id, ...doc.data(), requestTime: doc.get("requestTime").toDate() } as Swap);
        });

        setSections(res);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [courseID, studentID]);

  return [swaps, loading];
}

