import { Course } from "model/course";

export default function organizeCourseByTerm(courses: Course[]): Record<string, Course[]> {
    const organizedCourses: { [key: string]: Course[] } = {};
    for (const course of courses) {
        if (!organizedCourses[course.term]) {
            organizedCourses[course.term] = [];
        }
        organizedCourses[course.term].push(course);
    }
    return organizedCourses;
}