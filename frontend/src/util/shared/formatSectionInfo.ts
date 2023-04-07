import { Section } from "model/section";
import { formatSectionTime } from "./formatTime";

export default function formatSectionInfo(section: Section, abbreviated = false, align = false): string {
    const MAX_LENGTH = "Sun 12:30am - 2:30pm".length;
    const timeFormatted = formatSectionTime(section, abbreviated);
    const numExtraSpaces = align ? MAX_LENGTH - timeFormatted.length : 0;
    const location = section.location !== "" ? ` @ ${section.location}` : "";

    return timeFormatted + " ".repeat(numExtraSpaces) + location
}