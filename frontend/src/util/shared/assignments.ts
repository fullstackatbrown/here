import { Assignment } from "model/assignment";

// sort assignments by due date first, and then release date
export function sortAssignments(assignments: Assignment[]): Assignment[] {
    assignments.sort((a, b) => {
        const aDueDate = new Date(a.dueDate);
        const bDueDate = new Date(b.dueDate);
        if (aDueDate.getTime() !== bDueDate.getTime()) {
            return aDueDate.getTime() - bDueDate.getTime();
        }
        const aReleaseDate = new Date(a.releaseDate);
        const bReleaseDate = new Date(b.releaseDate);
        return aReleaseDate.getTime() - bReleaseDate.getTime();
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