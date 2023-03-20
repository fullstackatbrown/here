import { Section } from "model/section";

export default function sectionListToMap(sections: Section[]): Record<string, Section> {
    const map: Record<string, Section> = {};
    for (const section of sections) {
        map[section.ID] = section;
    }
    return map;
}