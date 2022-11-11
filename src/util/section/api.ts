import { Course } from "@util/course/api";

export interface Section {
    id: string;
    title: string;
    color: string;
    description?: string;
    course: Course;
    day: number;
    location: string;
    startTime: Date;
    endTime: Date;
    capacity: number;
    enrollment: number;
}