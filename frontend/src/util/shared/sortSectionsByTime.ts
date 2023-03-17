import { Section, Day } from "model/section";

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
export default function sortSectionsByTime(sections: Section[]): Section[] {
    // sort by weekday first, and then time 
    sections.sort((a, b) => {
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
    return sections;
}