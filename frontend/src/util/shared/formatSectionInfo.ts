import { Section } from "model/section";
import { formatSectionTime } from "./formatTime";

export default function formatSectionInfo(section: Section, abbreviated = false, withCapacity = false): string {
    if (section === undefined) {
        return "section not found";
    }
    const timeFormatted = formatSectionTime(section, abbreviated);
    const location = section.location !== "" ? ` @ ${section.location}` : "";

    const capacity = withCapacity ? ` (${section.capacity - section.numEnrolled} seats available)` : "";
    return timeFormatted + location + capacity
}

export function getSectionAvailableSeats(section: Section, assignmentID: string = undefined): number {
    if (section === undefined) {
        return 0;
    }
    let numEnrolled = section.numEnrolled;
    if (assignmentID) {
        numEnrolled -= section.swappedOutStudents[assignmentID]?.length ?? 0;
        numEnrolled += section.swappedInStudents[assignmentID]?.length ?? 0;
    }

    return section.capacity - numEnrolled;
}

export function formatSectionCapacity(section: Section, assignmentID: string = undefined): [number, string] {
    if (section === undefined) {
        return [0, `section not found`];
    }
    const availableSeats = getSectionAvailableSeats(section, assignmentID)
    return [availableSeats, `${availableSeats}/${section.capacity} seats available`];
}