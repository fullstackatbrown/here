export function CapitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Formats course code by removing all spaces and lowercasing the string
export function FormatCourseCode(code: string): string {
    return code.replace(/\s/g, "").toLowerCase();
}

// Formates course term by keeping at most one space between words and lowercasing the string
export function FormatCourseTerm(term: string): string {
    return term.replace(/\s+/g, " ").toLowerCase();
}