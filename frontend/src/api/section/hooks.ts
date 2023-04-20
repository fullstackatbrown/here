import { collection, getFirestore, onSnapshot } from "@firebase/firestore";
import { FirestoreCoursesCollection, FirestoreSectionsCollection } from "api/firebaseConst";
import { Section } from "model/section";
import { useEffect, useState } from "react";

export function useSectionsMap(courseID: string): [Record<string, Section> | undefined, boolean] {
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<Record<string, Section> | undefined>(undefined);

  useEffect(() => {
    const db = getFirestore();
    const unsubscribe = onSnapshot(collection(db, FirestoreCoursesCollection, courseID, FirestoreSectionsCollection), (querySnapshot) => {
      const res: Record<string, Section> = {};
      querySnapshot.forEach((doc) => {
        res[doc.id] = { ID: doc.id, ...doc.data() } as Section;
      });

      setSections(res);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [courseID]);

  return [sections, loading];
}