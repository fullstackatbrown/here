import { Course, CourseStatus } from "model/course";
import { indigo, blue, deepPurple, cyan, pink, red, purple, teal, grey } from '@mui/material/colors';

function hashCodeFromString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        let char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

export default function getCourseColor(course: Course): string {
    if (course.status === CourseStatus.CourseArchived) {
        return grey[500]
    }

    const colors = [
        indigo[500],
        blue[500],
        deepPurple[500],
        cyan[800],
        pink[900],
        purple[900],
        red[900],
        teal[900],
    ];

    const hash = hashCodeFromString(course.code);
    const colorIndex = Math.abs(hash % (colors.length - 1));
    return colors[colorIndex]
}

