import { Day, Section } from "model/section";
import { SurveyOption } from "model/survey";
import { formatSectionTime } from "./formatTime";
import { mapToList } from "./survey";

interface DayTime {
    day: Day;
    startTime: string;
    endTime: string;
}

const sorter: Record<Day, number> = {
    "Monday": 1,
    "Tuesday": 2,
    "Wednesday": 3,
    "Thursday": 4,
    "Friday": 5,
    "Saturday": 6,
    "Sunday": 7
};

function timeComparator(a: DayTime, b: DayTime): number {
    if (sorter[a.day] === sorter[b.day]) {
        const aTime = new Date(a.startTime);
        const bTime = new Date(b.startTime);
        if (aTime.getHours() === bTime.getHours()) {
            return aTime.getMinutes() - bTime.getMinutes();
        } else {
            return aTime.getHours() - bTime.getHours();
        }
    } else {
        return sorter[a.day] - sorter[b.day];
    }
}

// sort section by Day first, and then startTime
export function sortSections(sections: Section[]): Section[] {
    // sort by weekday first, and then time 
    sections.sort(timeComparator);
    return sections;
}

// Returns (1) a list of survey options (which is a list of unique section times with their total capacity)
// (2) a map from unique section times to the corresponding sections and their capacity
export function getUniqueSectionTimes(sections: Section[]): [SurveyOption[], Record<string, Record<string, number>>] {
    let times: Record<string, DayTime> = {};
    let capacity: Record<string, Record<string, number>> = {};
    for (const section of sections) {
        const t = formatSectionTime(section);
        if (!(t in times)) {
            times[t] = section;
            capacity[t] = {};
        }
        capacity[t][section.ID] = section.capacity;
    }
    const listOfSections = mapToList(times);
    listOfSections.sort((a, b) => timeComparator(times[a.option], times[b.option]));
    const surveyOptions = listOfSections.map(section => {
        const totalCapacity = Object.values(capacity[section.option]).reduce((a, b) => a + b, 0);
        return { option: section.option, capacity: totalCapacity };
    })

    return [surveyOptions, capacity];
}