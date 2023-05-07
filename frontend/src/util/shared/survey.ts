import { SurveyOption } from "model/survey";

export function mapToList<T>(map: Record<string, T>): SurveyOption[] {
    let list = [];
    for (const key in map) {
        list.push({ option: key, capacity: map[key] })
    }
    return list;
}

// count: number of students who chose the option
export type OptionCount = {
    option: string,
    count: number
}

export default function formatSurveyResponses(options: SurveyOption[], responses: Record<string, string[]>): OptionCount[] {
    let resCount: Record<string, number> = {};
    for (const option of options) {
        resCount[option.option] = 0;
    }
    for (const studentID in responses) {
        const times = responses[studentID];
        for (const time of times) {
            if (resCount[time] === undefined) {
                resCount[time] = 1
            } else {
                resCount[time] += 1
            }
        }
    }

    let list: OptionCount[] = [];
    for (const option in resCount) {
        list.push({ option: option, count: resCount[option] })
    }
    return list;
}