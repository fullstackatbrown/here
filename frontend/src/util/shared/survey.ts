import { Section } from "model/section";
import { formatSectionTime } from "./formatTime";

export interface KVPair {
    key: string,
    value: any
}

export function mapToList<T>(map: Record<string, T>): KVPair[] {
    let list = [];
    for (const key in map) {
        list.push({ key: key, value: map[key] })
    }
    return list;
}

export function getUniqueSectionTimes(sections: Section[]): KVPair[] {
    let times = {};
    for (const section of sections) {
        const t = formatSectionTime(section);
        if (!(t in times)) {
            times[t] = 0;
        }
        times[t] += section.capacity;
    }
    return mapToList(times);
}