import { Section } from "model/section";
import { formatSectionTime } from "./formatTime";

export default function formatSectionInfo(section: Section, abbreviated = false): string {
    const timeFormatted = formatSectionTime(section, abbreviated);
    const location = section.location !== "" ? ` @ ${section.location}` : "";

    return timeFormatted + location
}

export function getSectionAvailableSeats(section: Section, assignmentID: string = undefined): number {
    let numEnrolled = section.numEnrolled;
    if (assignmentID) {
        numEnrolled -= section.swappedOutStudents[assignmentID]?.length ?? 0;
        numEnrolled += section.swappedInStudents[assignmentID]?.length ?? 0;
    }

    return section.capacity - numEnrolled;
}

export function formatSectionCapacity(section: Section, assignmentID: string = undefined): [number, string] {
    const availableSeats = getSectionAvailableSeats(section, assignmentID)
    return [availableSeats, `${availableSeats}/${section.capacity} seats available`];
}