import { Section, Day } from "model/section";

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

// sort section by Day first, and then startTime
export function sortByTime(times: DayTime[]): DayTime[] {
    // sort by weekday first, and then time 
    times.sort((a, b) => {
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
    });

    return times;
}

export function sortSurveyTimes(times: string[]): string[] {
    let dayTimes: DayTime[] = [];
    times.forEach(time => {
        const [day, startTime, _, endTime] = time.split(" ");
        dayTimes.push({ day: day as Day, startTime: startTime, endTime: endTime });
    });
    const sorted = sortByTime(dayTimes);
    return sorted.map(section => `${section.day} ${section.startTime} - ${section.endTime}`);
}