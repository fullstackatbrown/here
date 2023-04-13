import { formatCourseCode, formatCourseName, validateCourseCode } from "./string";

export function parseBulkUpload(data: string) {

}

// Expected data comes in the format of 
// course_code,course_name
// e.g. cs101,Intro to Computer Science

// Returns a map from course_code to course_name, or an error message if any

// 1. Ignore empty course codes or names
// 2. For course code, lower case everything and remove all spaces
// 3. For course name, keep at most 1 space between words
// 3. Check for same course code but different course name

export function parseCourses(data: string): [Record<string, string> | undefined, string | undefined] {
    const lines = data.split("\n");
    const courses: Record<string, string> = {};
    for (const line of lines) {
        const [code, name] = line.split(",");
        if (code === "" || name === "" || !code || !name) {
            continue;
        }
        const courseCode = formatCourseCode(code);
        const courseName = formatCourseName(name);

        if (!validateCourseCode(courseCode)) {
            return [undefined, `Invalid course code: ${courseCode}`];
        }

        if (courseCode in courses) {
            if (courses[courseCode] !== courseName) {
                return [undefined, `Course ${courseCode} has different names.`];
            }
        }

        courses[courseCode] = courseName;
    }

    if (Object.keys(courses).length === 0) {
        return [undefined, "Must enter at least one valid course"];
    }
    return [courses, undefined];
}

export function parseTerm(term: string): [string | undefined, string | undefined] {
    const [season, year] = term.split(" ");
    if (!season || !year) {
        return [undefined, "Invalid term format"];
    }

    // Validate season using regex
    if (!/^(fall|winter|spring|summer)$/.test(season)) {
        return [undefined, "Invalid season"];
    }

    // Make sure year is at least the current year
    const currentYear = new Date().getFullYear();
    if (parseInt(year) < currentYear) {
        return [undefined, `Year must be at least ${currentYear}`];
    }

    const formattedTerm = `${season} ${year}`;
    return [formattedTerm, undefined];
}