import { Season } from "./terms";

export function capitalizeWords(str: string): string {
    // capitalize first letter of each word
    return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
    })
}

// Formats course code by removing all spaces and lowercasing the string
export function formatCourseCode(code: string): string {
    return code.replace(/\s/g, "").toLowerCase();
}

// Formates course term by keeping at most one space between words, lowercasing the string, and trimming the string
export function formatCourseTerm(term: [Season, string]): string {
    return `${term[0]} ${term[1]}`;
}

export function parseCourseTerm(term: string): [Season, string] {
    const [season, year] = term.split(" ");
    return [season as Season, year];
}

// Formats course name by keeping at most one space between words and trimming the string
export function formatCourseName(name: string): string {
    return name.replace(/\s+/g, " ").trim();
}

// course code must begin with 2-4 lower case letters, followed by 4 numbers, and more optional lower case letters
export function validateCourseCode(code: string): boolean {
    return /^[a-z]{2,4}\d{4}[a-z]*$/.test(code);
}

// https://stackoverflow.com/questions/46370725/how-to-do-email-validation-using-regular-expression-in-typescript
export function validateEmail(email: string): boolean {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}