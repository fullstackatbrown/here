import { FC, ReactNode } from 'react';
import Typography from '@mui/material/Typography';

interface StudentTableWrapperProps {
    students: any[];
    searchQuery: string;
    sectionFilter: string;
    children: ReactNode;
}

const StudentTableWrapper: FC<StudentTableWrapperProps> = ({ students, searchQuery, sectionFilter, children }) => {
    return (
        // there are three scenarios in which no students are displayed:
        // 1. the user is searching for a student that does not exist
        // 2. the user is filtering by section and no students joined that section yet
        // 3. no students joined the course yet
        students.length === 0 ? (
            searchQuery !== "" ? (
                <Typography mt={3} textAlign="center">No students match your search.</Typography>
            ) : sectionFilter !== "ALL_STUDENTS" ? (
                <Typography mt={3} textAlign="center">No students in this section.</Typography>
            ) : (
                <Typography mt={3} textAlign="center">No students have joined this course yet.</Typography>
            )
        ) : (
            <>{children}</>
        )
    );
}

export default StudentTableWrapper;
