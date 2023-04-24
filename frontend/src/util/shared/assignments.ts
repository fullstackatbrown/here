import { Assignment } from "model/assignment";

// sort assignments by due date first, and then release date
export function sortAssignments(assignments: Assignment[]): Assignment[] {
    assignments.sort((a, b) => {
        if (a.dueDate.getTime() !== b.dueDate.getTime()) {
            return a.dueDate.getTime() - b.dueDate.getTime();
        }
        return a.releaseDate.getTime() - b.releaseDate.getTime();
    });
    return assignments;
}

// filter out assignments whose release date is after today
export function filterAssignmentsByReleaseDate(assignments: Assignment[]): Assignment[] {
    const today = new Date();
    return assignments.filter(assignment => {
        return assignment.releaseDate.getTime() <= today.getTime();
    });

}

// filter out assignments whose due date is before today
export function filterAssignmentsByDueDate(assignments: Assignment[]): Assignment[] {
    const today = new Date();
    return assignments.filter(assignment => {
        return assignment.dueDate.getTime() >= today.getTime();
    });
}