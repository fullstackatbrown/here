import { Box, Divider, Grid, TablePagination, Typography, useMediaQuery } from "@mui/material";
import { Theme, styled } from "@mui/material/styles";
import { sortStudentsByName } from "@util/shared/formatStudentsList";
import { Assignment } from "model/assignment";
import { Course, CourseStatus, CourseUserData } from 'model/course';
import { Section } from "model/section";
import { FC, useEffect, useMemo, useState } from "react";
import StudentDialog from "./StudentDialog";
import { EnrolledStudentRow, InvitedStudentRow } from './StudentRow';

export interface PeopleTableProps {
    course: Course;
    students: CourseUserData[];
    sectionsMap: Record<string, Section>;
    assignments: Assignment[];
    invitedStudents: string[];
}

const GridItem = styled(Grid)(({ theme }) => ({
    display: "flex",
    alignItems: "center"
}))

const TableHeader = styled(Typography)(({ theme }) => ({
    fontWeight: 500,
    fontSize: 14
}))

interface StudentRowData {
    type: "enrolled" | "invited",
    student?: CourseUserData,
    email?: string,
}

const PeopleTable: FC<PeopleTableProps> = ({ course, assignments, students, sectionsMap, invitedStudents }) => {
    const isXsScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const rowsPerPage = isXsScreen ? -1 : 8;
    const [page, setPage] = useState(0);
    const isCourseActive = course.status === CourseStatus.CourseActive;

    const studentsDisplayed = useMemo(() => {
        const enrolledStudents = sortStudentsByName(students).map((student) => ({ type: "enrolled", student } as StudentRowData))
        const invitedStudentsRows = invitedStudents.map((email) => ({ type: "invited", email } as StudentRowData))
        return [...enrolledStudents, ...invitedStudentsRows]
    }, [students, invitedStudents])

    const [selectedStudent, setSelectedStudent] = useState<string | undefined>(undefined);

    return (
        <>
            <StudentDialog
                {...{ course, assignments, sectionsMap }}
                studentID={selectedStudent}
                open={selectedStudent !== undefined}
                onClose={() => setSelectedStudent(undefined)} />
            {!isXsScreen &&
                <>
                    <Grid container my={2}>
                        <GridItem item xs={10.8} md={11.5}>
                            <Grid container>
                                <GridItem item xs={12} md={3.5}>
                                    <TableHeader>Name</TableHeader>
                                </GridItem>
                                <GridItem item xs={12} md={4.2}>
                                    <TableHeader>Email</TableHeader>
                                </GridItem>
                                <GridItem item xs={12} md={4.3}>
                                    <TableHeader>Section</TableHeader>
                                </GridItem>
                            </Grid>
                        </GridItem>
                        <GridItem item xs={1.2} md={0.5}>
                        </GridItem>
                    </Grid>
                    <Divider />
                </>
            }
            {(rowsPerPage > 0
                ? studentsDisplayed.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : studentsDisplayed
            ).map((student) =>
                <Box key={student.type === "enrolled" ? student.student.studentID : student.email}>
                    {student.type === "enrolled" ?
                        <EnrolledStudentRow
                            courseID={course.ID}
                            {...{ student: student.student, sectionsMap, isCourseActive, setSelectedStudent, isXsScreen }}
                        />
                        :
                        <InvitedStudentRow
                            courseID={course.ID}
                            {...{ email: student.email, isCourseActive, isXsScreen }}
                        />
                    }
                    <Divider />
                </Box>
            )}
            {!isXsScreen && studentsDisplayed.length > rowsPerPage &&
                <TablePagination
                    rowsPerPageOptions={[]}
                    component="div"
                    count={studentsDisplayed.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(event: unknown, newPage: number) => setPage(newPage)}
                />
            }
        </>
    )
}

export default PeopleTable;