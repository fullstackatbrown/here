import { Section } from "model/general";

const dummySection: Section = {
  id: "csci1470",
  day: 1,
  startTime: "2021-09-01T00:00:00.000Z",
  endTime: "2021-09-01T00:00:00.000Z",
  location: "CIT 201",
  capacity: 30,
  enrollment: 3,
  /** student id */
  students: ["1", "2", "3"],
}

export function useSection(id: string): [Section | undefined, boolean] {
  return [
    dummySection, false
  ]
}

export function useSections(): [Section[] | undefined, boolean] {
  // TODO: make call to backend to get sections
  // TODO: implement with util/queue/hooks.ts as reference
  return [
    [
      dummySection
    ],
    false,
  ];
}
