import { Section } from "model/section";
import { useEffect, useState } from "react";
import { collection, doc, getFirestore, onSnapshot, query, where } from "@firebase/firestore";
import { FirestoreCoursesCollection, FirestoreSectionsCollection } from "api/firebaseConst";

const dummySection1: Section = {
  ID: "section1",
  courseID: "csci1470",
  day: "Thursday",
  startTime: "2021-09-01T00:00:00.000Z",
  endTime: "2021-09-01T00:00:00.000Z",
  location: "CIT 201",
  capacity: 10,
  swappedInStudents: {},
  swappedOutStudents: {},
}

const dummySection2: Section = {
  ID: "section2",
  courseID: "csci1470",
  day: "Tuesday",
  startTime: "2021-09-01T00:00:00.000Z",
  endTime: "2021-09-01T00:00:00.000Z",
  location: "CIT 110",
  capacity: 50,
  swappedInStudents: {},
  swappedOutStudents: {},
}

const dummySection3: Section = {
  ID: "section3",
  courseID: "csci1470",
  day: "Wednesday",
  startTime: "2021-09-01T00:00:00.000Z",
  endTime: "2021-09-01T00:00:00.000Z",
  location: "CIT 201",
  capacity: 30,
  swappedInStudents: {},
  swappedOutStudents: {},
}

export const dummySectionsMap = {
  "section1": dummySection1,
  "section2": dummySection2,
  "section3": dummySection3,
}

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

  // Uncomment this for testing
  // return [
  //       [
  //         dummySection1,
  //         dummySection2,
  //         dummySection3,
  //       ],
  //       false,
  //     ];
  // if (doc.data().courseID === courseID) {

  // }

  let filteredSections: Section[] | undefined = loading ? undefined : sections.filter((section) => section.courseID === courseID);
  return [filteredSections, loading];
}
