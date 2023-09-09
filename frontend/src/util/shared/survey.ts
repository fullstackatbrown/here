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
    count: number,
    students: string[],
    optionExists: boolean,
}

export default function formatSurveyResponses(options: SurveyOption[], responses: Record<string, string[]>): OptionCount[] {
    // Map from option to number of students who chose that option
    let resCount: Record<string, number> = {};

    // Map from option to list of students who chose that option
    let resStudents: Record<string, string[]> = {};

    for (const option of options) {
        resCount[option.option] = 0;
        resStudents[option.option] = [];
    }

    for (const studentID in responses) {
        const times = responses[studentID];
        for (const time of times) {
            // Increment count for this option
            if (resCount[time] === undefined) {
                resCount[time] = 1
            } else {
                resCount[time] += 1
            }
            // Add student to list of students who chose this option
            if (resStudents[time] === undefined) {
                resStudents[time] = [studentID];
            } else {
                resStudents[time].push(studentID);
            }
        }
    }

    let list: OptionCount[] = [];
    for (const option in resCount) {
        list.push({
            option: option, count: resCount[option],
            students: resStudents[option],
            optionExists: options.find(o => o.option === option) !== undefined
        })
    }
    return list;
}