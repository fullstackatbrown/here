import { CourseUserData } from "model/course"

export const filterStudentsBySearchQuery = (students: CourseUserData[], searchQuery: string): CourseUserData[] => {
    return students.filter((student) => {
        // either student.displayName starts with the search query or student.email starts with the search query
        return student.displayName.toLowerCase().startsWith(searchQuery.toLowerCase()) || student.email.toLowerCase().startsWith(searchQuery.toLowerCase())
    })
}