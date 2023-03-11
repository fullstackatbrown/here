
// This function takes in a map from student ID to a list of times they are available for
// and outputs a map from time to the number of students who are available at that time
export function formatSectionResponses(responses: Record<string, string[]>): Record<string, number> {
    let formattedResponses: Record<string, number> = {};
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

export type TimeCount = {
    time: string,
    count: number
}

export function mapToList(map: Record<string, number>): TimeCount[] {
    let list: { time: string, count: number }[] = [];
    for (const time in map) {
        list.push({ time: time, count: map[time] })
    }
    return list;
}