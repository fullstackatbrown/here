
// students is a map of studentID to sectionID

import { CourseUserData } from "model/course";

export const ALL_STUDENTS = "All Students"
export const UNASSIGNED = "Unassigned"

// loop through students and return an array of studentIDs that are in the section
export default function getStudentsInSection(students: Record<string, CourseUserData>, sectionID: string): string[] {
    if (sectionID === ALL_STUDENTS) {
        return Object.keys(students);
    } else if (sectionID === UNASSIGNED) {
        return Object.keys(students).filter((studentID) => {
            const defaultSection = students[studentID].defaultSection;
            return !defaultSection || defaultSection === "";
        });
    }

    return Object.keys(students).filter((studentID) => {
        const defaultSection = students[studentID].defaultSection;
        return defaultSection === sectionID;
    })
}