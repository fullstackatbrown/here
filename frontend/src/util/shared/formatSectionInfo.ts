import { Section } from "model/section";
import { formatSectionTime } from "./formatTime";

export default function formatSectionInfo(section: Section, abbreviated = false): string {
    const MAX_LENGTH = "Sun 12:30am - 12:30pm".length;
    const timeFormatted = formatSectionTime(section, abbreviated);
    const location = section.location !== "" ? ` @ ${section.location}` : "";

    return timeFormatted + location
}