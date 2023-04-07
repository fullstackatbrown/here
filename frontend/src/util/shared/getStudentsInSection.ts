
// students is a map of studentID to sectionID

import { CourseUserData } from "model/course";

// loop through students and return an array of studentIDs that are in the section
export default function getStudentsInSection(students: Record<string, CourseUserData>, sectionID: string): string[] {
    const studentsInSection: string[] = [];
    Object.keys(students).forEach((studentID) => {
        if (students[studentID].defaultSection === sectionID) {
            studentsInSection.push(studentID);
        }
    });
    return studentsInSection;
}