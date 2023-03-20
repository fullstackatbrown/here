
// This function takes in a map from student ID to a list of times they are available for

import { formatSurveyTime } from "./formatTime";
import { sortSurveyResponses } from "./sortSectionTime";

export type TimeCount = {
    time: string,
    count: number
}

export default function formatSectionResponses(capacity: Record<string, Record<string, number>>, responses: Record<string, string[]>): TimeCount[] {
    let formattedRes = mapToList(getSectionAvailability(capacity, responses))
    formattedRes = sortSurveyResponses(formattedRes)
    formattedRes = formattedRes.map((t: TimeCount, _) => { return { time: formatSurveyTime(t.time), count: t.count } })
    return formattedRes
}

// outputs a map from time to the number of students who are available at that time
function getSectionAvailability(capacity: Record<string, Record<string, number>>, responses: Record<string, string[]>): Record<string, number> {
    let formattedResponses: Record<string, number> = {};
    for (const time in capacity) {
        formattedResponses[time] = 0;
    }
    for (const studentID in responses) {
        const times = responses[studentID];
        for (const time of times) {
            if (formattedResponses[time] === undefined) {
                formattedResponses[time] = 1
            } else {
                formattedResponses[time] += 1
            }
        }
    }
    return formattedResponses;
}

function mapToList(map: Record<string, number>): TimeCount[] {
    let list: { time: string, count: number }[] = [];
    for (const time in map) {
        list.push({ time: time, count: map[time] })
    }
    return list;
}