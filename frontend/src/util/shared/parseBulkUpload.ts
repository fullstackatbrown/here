import { SinglePermissionRequest } from "model/course";
import { formatCourseCode, formatCourseName, validateCourseCode, validateEmail } from "./string";
import { CoursePermission } from "model/user";

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


// Expected data comes in the format of
// email,role,course_code
// 1. if any field is empty, ignore the line
// 2. role can only be "admin" or "staff"
// 3. email must be a valid email
// 4. course code must be a valid course code, i.e. can be found in the courses Record
// 5. one email cannot have two roles for the same course

// Returns a map from coursecode to a list of SinglePermissionRequest, or an error message if any
export function parseStaffData(data: string, courses: Record<string, string>): [Record<string, SinglePermissionRequest[]> | undefined, string | undefined] {

    const lines = data.split("\n");
    const staff: Record<string, SinglePermissionRequest> = {};
    const permissionsByCourse: Record<string, SinglePermissionRequest[]> = {};
    for (const line of lines) {
        const [email, role, courseCode] = line.split(",");
        // Ignore line if any field is empty
        if (email === "" || role === "" || courseCode === "" || !email || !role || !courseCode) {
            continue;
        }

        // Validate role
        const formattedRole = role.toLowerCase().trim();
        if (formattedRole !== "admin" && formattedRole !== "staff") {
            return [undefined, `Invalid role: ${role}`];
        }

        if (!validateEmail(email)) {
            return [undefined, `Invalid email: ${email}`];
        }

        if (!(formatCourseCode(courseCode) in courses)) {
            return [undefined, `Course code not found: ${courseCode}`];
        }

        if (email in staff) {
            if (staff[email].permission !== role) {
                return [undefined, `Email ${email} has different roles for the same course`];
            }
        }

        staff[email] = {
            email,
            permission: formattedRole as CoursePermission,
        };

        if (courseCode in permissionsByCourse) {
            permissionsByCourse[courseCode].push(staff[email]);
        } else {
            permissionsByCourse[courseCode] = [staff[email]];
        }
    }

    if (Object.keys(staff).length === 0) {
        return [undefined, "Must enter at least one valid staff member"];
    }
    return [permissionsByCourse, undefined];
}