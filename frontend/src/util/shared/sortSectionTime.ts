import { Section, Day } from "model/section";
import { TimeCount } from "./formatSectionResponses";
import { formatSectionTime } from "./formatTime";
import { Option, mapToList } from "./survey";

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

export function sortSurveyResponses(times: TimeCount[]): TimeCount[] {
    let dayTimes: DayTime[] = [];
    times.forEach(t => {
        const [day, startTime, endTime] = t.time.split(",");
        dayTimes.push({ day: day as Day, startTime: startTime, endTime: endTime });
    });
    dayTimes.sort(timeComparator);
    return dayTimes.map(section => {
        const time = `${section.day},${section.startTime},${section.endTime}`
        const count = times.find(t => t.time === time)?.count || 0;
        return { time, count }
    });
}

export function getUniqueSectionTimes(sections: Section[]): Option[] {
    let times: Record<string, DayTime> = {};
    let capacity: Record<string, number> = {};
    for (const section of sections) {
        const t = formatSectionTime(section);
        if (!(t in times)) {
            times[t] = section;
            capacity[t] = section.capacity;
        } else {
            capacity[t] += section.capacity;
        }
    }
    const listOfSections = mapToList(times);
    listOfSections.sort((a, b) => timeComparator(times[a.option], times[b.option]));
    return listOfSections.map(section => {
        return { option: section.option, capacity: capacity[section.option] };
    })
}