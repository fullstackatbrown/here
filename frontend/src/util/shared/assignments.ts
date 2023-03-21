import { Assignment } from "model/assignment";

// sort assignments by due date
export function sortAssignments(assignments: Assignment[]): Assignment[] {
    assignments.sort((a, b) => {
        const aDate = new Date(a.dueDate);
        const bDate = new Date(b.dueDate);
        return aDate.getTime() - bDate.getTime();
    });
    return assignments;
}

// filter out assignments whose release date is after today
export function filterAssignmentsByReleaseDate(assignments: Assignment[]): Assignment[] {
    const today = new Date();
    return assignments.filter(assignment => {
        const releaseDate = new Date(assignment.releaseDate);
        return releaseDate.getTime() <= today.getTime();
    });

}