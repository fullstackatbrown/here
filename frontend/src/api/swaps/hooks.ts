import { Swap } from "model/swap";
import { useEffect, useState } from "react";
import { collection, doc, getFirestore, onSnapshot, query, where } from "@firebase/firestore";
import { FirestoreCoursesCollection, FirestoreSwapsCollection } from "api/firebaseConst";

export const dummySwapRequest1: Swap = {
  ID: "swap-request-1",
  studentID: "unnamed student #667",
  oldSectionID: "section1",
  newSectionID: "section2",
  requestTime: "2023-03-03T09:00:00.000Z",
  reason: "I screen shotted classmate's NFT and now he's out to get me",
  status: "approved",
  handledBy: "unnamed TA #2301",
};

export const dummySwapRequest2: Swap = {
  ID: "swap-request-2",
  studentID: "unnamed student #97",
  oldSectionID: "section2",
  newSectionID: "section3",
  requestTime: "2023-03-03T09:00:00.000Z",
  reason: "I want to work in a room with windows and natural light",
  status: "denied",
  handledBy: "unnamed TA #4429",
};

export const dummySwapRequest3: Swap = {
  ID: "swap-request-3",
  studentID: "unnamed student #438",
  oldSectionID: "section3",
  newSectionID: "section1",
  requestTime: "2023-03-03T09:00:00.000Z",
  reason:
    "My phone went off last section when everything was quiet and not I'm too embarrassed to go back :(",
  status: "pending",
  handledBy: "unnamed TA #9328",
};

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

  return [[dummySwapRequest1, dummySwapRequest2, dummySwapRequest3], false];
  return [swaps, loading];
}