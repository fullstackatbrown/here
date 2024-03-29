// Terms is a concatenation between season and year
// Season is a string with the following values: "Winter", "Fall", "Summer", "Spring"
// Year is a string with the following format: "YYYY"

export enum Season {
    Winter = "winter",
    Fall = "fall",
    Summer = "summer",
    Spring = "spring",
}

import { Course } from "model/course";

function termComparator(a: string, b: string) {
    const [aSeason, aYear] = a.toLowerCase().split(" ");
    const [bSeason, bYear] = b.toLowerCase().split(" ");

    if (aYear > bYear) {
        return -1;
    } else if (aYear < bYear) {
        return 1;
    } else {
        if (aSeason === "winter") {
            return -1;
        } else if (aSeason === "fall") {
            return bSeason === "winter" ? 1 : -1;
        } else if (aSeason === "summer") {
            return bSeason === "spring" ? -1 : 1;
        }
        return 1;
    }
}
// Sort the terms in descending order, with the most recent term first
export default function sortTerms(terms: string[]): string[] {
    return terms.sort((a, b) => termComparator(a, b));
}

export function sortCoursesByTerm(courses: Course[]): Course[] {
    return courses.sort((a, b) => termComparator(a.term, b.term));
}

export function getTerms(courses: Record<string, Course[]>, includeCurrentTerm: boolean = true): string[] {
    let terms = []
    if (courses) {
        terms = sortTerms(Object.keys(courses));
    }
    if (includeCurrentTerm) {
        const currentTerm = getCurrentTerm();
        if (terms.length === 0) { return [currentTerm] }
        if (!terms.includes(currentTerm)) {
            // loop through terms and add it to the appropriate index
            for (let i = 0; i < terms.length; i++) {
                if (termComparator(terms[i], currentTerm) > 0) {
                    terms.splice(i, 0, currentTerm);
                    break;
                }
            }
        }
    }
    return terms
}

// compute current term based on current month
export function getCurrentTerm(): string {
    return `${getCurrentSeason()} ${getCurrentYear()}`;
}

export function getCurrentSeason(): Season {
    const date = new Date();
    const month = date.getMonth();

    if (month >= 0 && month <= 4) {
        return Season.Spring;
    }
    if (month >= 5 && month <= 7) {
        return Season.Summer;
    }
    if (month >= 8 && month <= 11) {
        return Season.Fall;
    }
}

export function getCurrentYear(): string {
    const date = new Date();
    return `${date.getFullYear()}`;
}