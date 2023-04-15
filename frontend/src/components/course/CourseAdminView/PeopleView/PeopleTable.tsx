import { IconButton, Table, TableBody, TableFooter, TableHead, TablePagination, TableRow, Tooltip } from "@mui/material";
import MuiTableCell from "@mui/material/TableCell";
import ClearIcon from '@mui/icons-material/Clear';
import { styled } from "@mui/material/styles";
import formatSectionInfo from "@util/shared/formatSectionInfo";
import { sortStudentsByName } from "@util/shared/formatStudentsList";
import { useAssignments } from "api/assignment/hooks";
import { Assignment } from "model/assignment";
import { Course, CourseUserData } from 'model/course';
import { Section } from "model/section";
import { FC, useEffect, useState } from "react";
import StudentDialog from "./StudentDialog";
import { User } from "model/user";
import CourseAPI from "api/course/api";
import toast from "react-hot-toast";
import { handleBadRequestError } from "@util/errors";

export interface PeopleTableProps {
    course: Course;
    students: CourseUserData[];
    sectionsMap: Record<string, Section>;
    assignments: Assignment[];
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

const PeopleTable: FC<PeopleTableProps> = ({ course, assignments, students, sectionsMap }) => {
    const rowsPerPage = 10;
    const [studentsSorted, setStudentsSorted] = useState<CourseUserData[]>(sortStudentsByName(students));
    const [page, setPage] = useState(0);
    const [selectedStudent, setSelectedStudent] = useState<string | undefined>(undefined);

    useEffect(() => {
        setStudentsSorted(sortStudentsByName(students))
    }, [students])

    const handleRemoveStudent = (student: CourseUserData) => {
        return (e: React.MouseEvent<HTMLElement>) => {
            e.stopPropagation();
            const confirmed = confirm(`Are you sure you want to remove ${student.displayName} from this course?`);
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
                                            <IconButton onClick={handleRemoveStudent(student)} size={"small"}>
                                                <ClearIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
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