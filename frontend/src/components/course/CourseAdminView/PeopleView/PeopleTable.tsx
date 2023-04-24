import ClearIcon from '@mui/icons-material/Clear';
import { IconButton, Table, TableBody, TableHead, TablePagination, TableRow, Tooltip } from "@mui/material";
import MuiTableCell from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
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
import { useDialog } from '@components/shared/ConfirmDialog/ConfirmDialogProvider';

export interface PeopleTableProps {
    course: Course;
    students: CourseUserData[];
    sectionsMap: Record<string, Section>;
    assignments: Assignment[];
    displayInvitedStudents: boolean;
    invitedStudents: string[];
}

const TableCell = styled(MuiTableCell)(({ theme }) => ({
    ":first-of-type": {
        paddingLeft: 0,
    },
    ":last-of-type": {
        width: 80,
        maxWidth: 80,
        overflow: "hidden",
    },
}))

const PeopleTable: FC<PeopleTableProps> = ({ course, assignments, students, sectionsMap, displayInvitedStudents, invitedStudents }) => {
    const rowsPerPage = 10;
    const [studentsSorted, setStudentsSorted] = useState<CourseUserData[]>(sortStudentsByName(students));
    const [page, setPage] = useState(0);
    const [selectedStudent, setSelectedStudent] = useState<string | undefined>(undefined);
    const isCourseActive = course.status === CourseStatus.CourseActive;
    const showDialog = useDialog();

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
            <Table>
                <colgroup>
                    <col width="25%" />
                    <col width="35%" />
                    <col width="35%" />
                    <col width="5%" />
                </colgroup>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Section</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {/* TODO: the pagination is no longer right due to invited students */}
                    {studentsSorted
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((student) => {
                            return (
                                <TableRow key={student.studentID} hover onClick={() => { setSelectedStudent(student.studentID) }}>
                                    <TableCell component="th" scope="row">
                                        {student.displayName}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {student.email}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {student.defaultSection ? formatSectionInfo(sectionsMap[student.defaultSection], true) : "Unassigned"}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <Tooltip title="Remove from course" placement="right">
                                            <IconButton onClick={handleRemoveStudent(student)} size={"small"} disabled={!isCourseActive}>
                                                <ClearIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    {displayInvitedStudents && invitedStudents?.map((email) => {
                        return (
                            <Tooltip key={email} title="Waiting for student to log in" placement="right">
                                <TableRow hover>
                                    <TableCell component="th" scope="row">
                                        Pending
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {email}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        /
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <Tooltip title="Remove from course" placement="right">
                                            <IconButton onClick={handleRemoveInvite(email)} size={"small"} disabled={!isCourseActive}>
                                                <ClearIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            </Tooltip>
                        );
                    })}
                </TableBody>
            </Table>
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