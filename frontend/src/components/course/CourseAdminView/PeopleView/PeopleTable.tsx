import { Table, TableBody, TableFooter, TableHead, TablePagination, TableRow } from "@mui/material";
import MuiTableCell from "@mui/material/TableCell";
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

    return (
        <>
            <StudentDialog
                {...{ course, assignments, sectionsMap }}
                studentID={selectedStudent}
                open={selectedStudent !== undefined}
                onClose={() => setSelectedStudent(undefined)} />
            <Table>
                <colgroup>
                    <col width="20%" />
                    <col width="30%" />
                    <col width="20%" />
                    <col width="30%" />
                </colgroup>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Section</TableCell>
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
                                        Student
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {student.defaultSection ? formatSectionInfo(sectionsMap[student.defaultSection], true) : "Unassigned"}
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