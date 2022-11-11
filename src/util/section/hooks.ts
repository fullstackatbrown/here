import { Section } from "@util/section/api";

export function useSections(): [Section[] | undefined, boolean] {
    // TODO: make call to backend to get sections
    return [
        [{
            id: "1",
            title: "Section 1",
            color: "#123456",
            description: "This is a section",
            course: {
                id: "1",
                title: "Deep Learning",
                code: "CSCI 1470",
                term: "Fall 2022",
                coursePermissions: {}
            },
            day: 1,
            location: "CIT 477",
            startTime: new Date(),
            endTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
            capacity: 100,
            enrollment: 50
        }], false
    ]
}