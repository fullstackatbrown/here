import { Box, Divider, Grid, TablePagination, Typography, useMediaQuery } from "@mui/material";
import { Theme, styled } from "@mui/material/styles";
import { sortByName } from "@util/shared/user";
import { Assignment } from "model/assignment";
import { Course, CourseStatus, CourseUserData } from 'model/course';
import { Section } from "model/section";
import { CoursePermission, User } from "model/user";
import { FC, useMemo, useState } from "react";
import StudentDialog from "./StudentDialog";
import { EnrolledStudentRow, InvitedStudentRow } from './StudentRow';

export interface PeopleTableProps {
    course: Course;
    students: CourseUserData[];
    sectionsMap: Record<string, Section>;
    assignments: Assignment[];
    invitedStudents: string[];
    access: CoursePermission;
    page: number;
    setPage: (page: number) => void;
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

const PeopleTable: FC<PeopleTableProps> = ({ course, assignments, students, sectionsMap, invitedStudents, access, page, setPage }) => {
    const isXsScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const rowsPerPage = isXsScreen ? -1 : 8;
    const isCourseActive = course.status === CourseStatus.CourseActive;

    const studentsDisplayed = useMemo(() => {
        const enrolledStudents = sortByName(students).map((student) => ({ type: "enrolled", student } as StudentRowData))
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
            {(rowsPerPage > 0 && studentsDisplayed.length > rowsPerPage
                // only paginate when the number of students displayed is greater than the number of rows per page
                ? studentsDisplayed.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : studentsDisplayed
            ).map((rowData) =>
                <Box key={rowData.type === "enrolled" ? rowData.student.studentID : rowData.email}>
                    {rowData.type === "enrolled" ?
                        <EnrolledStudentRow
                            courseID={course.ID}
                            {...{ student: rowData.student, sectionsMap, isCourseActive, setSelectedStudent, isXsScreen, access }}
                        />
                        :
                        // We do not need to pass "access" to InvitedStudentRow because invited students cannot be seen by other students
                        <InvitedStudentRow
                            courseID={course.ID}
                            {...{ email: rowData.email, isCourseActive, isXsScreen, access }}
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