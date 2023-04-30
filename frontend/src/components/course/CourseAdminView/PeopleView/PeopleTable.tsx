import { useDialog } from '@components/shared/ConfirmDialog/ConfirmDialogProvider';
import ClearIcon from '@mui/icons-material/Clear';
import { Box, Divider, Grid, IconButton, TablePagination, Tooltip, Typography, useMediaQuery } from "@mui/material";
import MuiTableCell from "@mui/material/TableCell";
import { Theme, styled, useTheme } from "@mui/material/styles";
import { handleBadRequestError } from "@util/errors";
import formatSectionInfo from "@util/shared/formatSectionInfo";
import { sortStudentsByName } from "@util/shared/formatStudentsList";
import CourseAPI from "api/course/api";
import { Assignment } from "model/assignment";
import { Course, CourseStatus, CourseUserData } from 'model/course';
import { Section } from "model/section";
import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import StudentDialog from "./StudentDialog";

export interface PeopleTableProps {
    course: Course;
    students: CourseUserData[];
    sectionsMap: Record<string, Section>;
    assignments: Assignment[];
    displayInvitedStudents: boolean;
    invitedStudents: string[];
}

// const TableCell = styled(MuiTableCell)(({ theme }) => ({
//     ":first-of-type": {
//         paddingLeft: 0,
//     },
//     ":last-of-type": {
//         width: 80,
//         maxWidth: 80,
//         overflow: "hidden",
//     },
// }))

const GridItem = styled(Grid)(({ theme }) => ({
    display: "flex",
    alignItems: "center"
}))

const TableHeader = styled(Typography)(({ theme }) => ({
    fontWeight: 500,
    fontSize: 14
}))

const TableCell = styled(Typography)(({ theme }) => ({
    fontSize: 14
}))


const PeopleTable: FC<PeopleTableProps> = ({ course, assignments, students, sectionsMap, displayInvitedStudents, invitedStudents }) => {
    const rowsPerPage = 10;
    const [studentsSorted, setStudentsSorted] = useState<CourseUserData[]>(sortStudentsByName(students));
    const [page, setPage] = useState(0);
    const [selectedStudent, setSelectedStudent] = useState<string | undefined>(undefined);
    const isCourseActive = course.status === CourseStatus.CourseActive;
    const showDialog = useDialog();
    const isXsScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const theme = useTheme();

    useEffect(() => {
        setStudentsSorted(sortStudentsByName(students))
    }, [students])

    const handleRemoveStudent = (student: CourseUserData) => {
        return async (e: React.MouseEvent<HTMLElement>) => {
            e.stopPropagation();
            const confirmed = await showDialog({
                title: 'Remove Student',
                message: `Are you sure you want to remove ${student.displayName} from this course?`,
            });
            if (confirmed) {
                toast.promise(CourseAPI.deleteStudent(course.ID, student.studentID), {
                    loading: "Removing student...",
                    success: "Student removed",
                    error: (err) => handleBadRequestError(err),
                })
                    .catch(() => { })
            }
        }
    }

    const handleRemoveInvite = (email: string) => {
        return async (e: React.MouseEvent<HTMLElement>) => {
            e.stopPropagation();
            const confirmed = await showDialog({
                title: 'Remove Student',
                message: `Are you sure you want to remove ${email} from this course?`,
            });
            if (confirmed) {
                toast.promise(CourseAPI.deleteStudent(course.ID, undefined, email), {
                    loading: "Removing student...",
                    success: "Student removed",
                    error: (err) => handleBadRequestError(err),
                })
                    .catch(() => { })
            }
        }
    }

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
            {studentsSorted
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((student) => (
                    <Box
                        sx={{ "&:hover": { backgroundColor: theme.palette.action.hover } }}
                        onClick={() => { setSelectedStudent(student.studentID) }}
                    >
                        <Grid container py={1.8}>
                            <GridItem item xs={10.8} md={11.5}>
                                <Grid container>
                                    <GridItem item xs={12} md={3.5}>
                                        <Typography fontSize={isXsScreen ? 15 : 14} fontWeight={isXsScreen ? 500 : 400}>
                                            {student.displayName}
                                        </Typography>
                                    </GridItem>
                                    <GridItem item xs={12} md={4.2}>
                                        <TableCell>{student.email}</TableCell>
                                    </GridItem>
                                    <GridItem item xs={12} md={4.3}>
                                        <TableCell>{student.defaultSection ? formatSectionInfo(sectionsMap[student.defaultSection], true) : "Unassigned"}</TableCell>
                                    </GridItem>
                                </Grid>
                            </GridItem>
                            <GridItem xs={1.2} md={0.5}>
                                <Tooltip title="Remove from course" placement="right" disableTouchListener>
                                    <IconButton onClick={handleRemoveStudent(student)} size={"small"} disabled={!isCourseActive}>
                                        <ClearIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </GridItem>
                        </Grid>
                        <Divider />
                    </Box>
                ))}
            {displayInvitedStudents && invitedStudents?.map((email) => {
                return (
                    <Tooltip key={email} title="Waiting for student to log in" placement="right">
                        <Box>
                            <Grid container py={1.8}>
                                <GridItem item xs={10.8} md={11.5}>
                                    <Grid container>
                                        <GridItem item xs={12} md={3.5}>
                                            <Typography fontSize={isXsScreen ? 15 : 14} fontWeight={isXsScreen ? 500 : 400}>
                                                Pending
                                            </Typography>
                                        </GridItem>
                                        <GridItem item xs={12} md={4.2}>
                                            <TableCell>{email}</TableCell>
                                        </GridItem>
                                        <GridItem item xs={12} md={4.3}>
                                            {!isXsScreen && <TableCell>/</TableCell>}
                                        </GridItem>
                                    </Grid>
                                </GridItem>
                                <GridItem xs={1.2} md={0.5}>
                                    <Tooltip title="Remove from course" placement="right" disableTouchListener>
                                        <IconButton onClick={handleRemoveInvite(email)} size={"small"} disabled={!isCourseActive}>
                                            <ClearIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </GridItem>
                            </Grid>
                            <Divider />
                        </Box>
                    </Tooltip>
                );
            })}


            {students.length > rowsPerPage && <TablePagination
                rowsPerPageOptions={[]}
                component="div"
                count={students.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event: unknown, newPage: number) => setPage(newPage)}
            />}
        </>
    )
}

export default PeopleTable;