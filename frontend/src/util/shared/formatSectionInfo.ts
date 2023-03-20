import { Section } from "model/section";
import formatSectionTime from "./formatTime";

export default function formatSectionInfo(section: Section): string {
    return formatSectionTime(section) + " @ " + section.location;
}