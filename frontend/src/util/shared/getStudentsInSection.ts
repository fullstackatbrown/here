
// students is a map of studentID to sectionID
// loop through students and return an array of studentIDs that are in the section
export default function getStudentsInSection(students: Record<string, string>, sectionID: string): string[] {
    const studentsInSection: string[] = [];
    Object.keys(students).forEach((studentID) => {
        if (students[studentID] === sectionID) {
            studentsInSection.push(studentID);
        }
    });
    return studentsInSection;
}