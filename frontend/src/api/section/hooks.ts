import { Section } from "model/section";
import { useEffect, useState } from "react";
import { collection, doc, getFirestore, onSnapshot, query, where } from "@firebase/firestore";
import { FirestoreCoursesCollection, FirestoreSectionsCollection } from "api/firebaseConst";
import { sortSections } from "@util/shared/sortSectionTime";

export function useSections(courseID: string): [Section[] | undefined, boolean] {
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<Section[] | undefined>(undefined);

  useEffect(() => {
    const db = getFirestore();
    const unsubscribe = onSnapshot(collection(db, FirestoreCoursesCollection, courseID, FirestoreSectionsCollection), (querySnapshot) => {
      const res: Section[] = [];
      querySnapshot.forEach((doc) => {
        res.push({ ID: doc.id, ...doc.data() } as Section);
      });

      setSections(res);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [courseID]);

  return [sections ? sortSections(sections) : undefined, loading];
}