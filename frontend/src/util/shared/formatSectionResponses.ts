
// This function takes in a map from student ID to a list of times they are available for
// and outputs a map from time to the number of students who are available at that time
export default function formatSectionResponses(responses: Record<string, string[]>): Record<string, number> {
    let formattedResponses: Record<string, number> = {};
    for (const studentID in responses) {
        console.log(studentID)
        const times = responses[studentID];
        for (const time of times) {
            console.log(time)
            if (formattedResponses[time] === undefined) {
                formattedResponses[time] = 1
            } else {
                formattedResponses[time] += 1
            }
        }
    }
    return formattedResponses;

}