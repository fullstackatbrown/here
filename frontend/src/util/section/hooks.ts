import { Section } from "model/section";

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

export function useSection(id: string): [Section | undefined, boolean] {
  return [
    dummySection1, false
  ]
}

export function useSections(): [Section[] | undefined, boolean] {
  // TODO: make call to backend to get sections
  // TODO: implement with util/queue/hooks.ts as reference
  return [
    [
      dummySection1,
      dummySection2,
      dummySection3,
    ],
    false,
  ];
}
