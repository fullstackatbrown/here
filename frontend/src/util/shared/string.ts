export function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Formats course code by removing all spaces and lowercasing the string
export function formatCourseCode(code: string): string {
    return code.replace(/\s/g, "").toLowerCase();
}

// Formates course term by keeping at most one space between words, lowercasing the string, and trimming the string
export function formatCourseTerm(term: string): string {
    return term.replace(/\s+/g, " ").toLowerCase().trim();;
}

// Formats course name by keeping at most one space between words and trimming the string
export function formatCourseName(name: string): string {
    return name.replace(/\s+/g, " ").trim();
}

// course code must begin with 2-4 lower case letters, followed by 4 numbers, and more optional lower case letters
export function validateCourseCode(code: string): boolean {
    return /^[a-z]{2,4}\d{4}[a-z]*$/.test(code);
}
