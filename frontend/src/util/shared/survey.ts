import { SurveyOption } from "model/survey";

export function mapToList<T>(map: Record<string, T>): SurveyOption[] {
    let list = [];
    for (const key in map) {
        list.push({ option: key, capacity: map[key] })
    }
    return list;
}

// count: number of students who chose the option
export type OptionDetails = {
    option: string,
    count: number,
    students: string[],
    optionExists: boolean,
}

export default function formatSurveyResponses(options: SurveyOption[], responses: Record<string, string[]>): OptionDetails[] {
    // Map from option to list of students who chose that option
    let resStudents: Record<string, string[]> = {};

    for (const option of options) {
        resStudents[option.option] = [];
    }

    for (const studentID in responses) {
        const times = responses[studentID];
        for (const time of times) {
            // Add student to list of students who chose this option
            if (resStudents[time] === undefined) {
                resStudents[time] = [studentID];
            } else {
                resStudents[time].push(studentID);
            }
        }
    }

    let list: OptionDetails[] = [];
    for (const option in resStudents) {
        list.push({
            option: option, count: resStudents[option].length,
            students: resStudents[option],
            optionExists: options.find(o => o.option === option) !== undefined
        })
    }
    return list;
}