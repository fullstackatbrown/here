import { Section, Day } from "model/section";
import { TimeCount } from "./formatSectionResponses";

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

export function sortSurveyTimes(times: string[]): string[] {
    let dayTimes: DayTime[] = [];
    times.forEach(time => {
        const [day, startTime, endTime] = time.split(",");
        dayTimes.push({ day: day as Day, startTime: startTime, endTime: endTime });
    });
    dayTimes.sort(timeComparator);
    return dayTimes.map(section => `${section.day},${section.startTime},${section.endTime}`);
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


