import { Table, TableBody, TableFooter, TableHead, TablePagination, TableRow } from "@mui/material";
import MuiTableCell from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import formatSectionInfo from "@util/shared/formatSectionInfo";
import { CourseUserData } from 'model/course';
import { Section } from "model/section";
import { FC, useEffect, useState } from "react";

export interface PeopleTableProps {
    students: CourseUserData[];
    sectionsMap: Record<string, Section>;
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

const sortByName = (students: CourseUserData[]) => {
    return students.sort((a, b) => {
        if (a.displayName < b.displayName) return -1;
        if (a.displayName > b.displayName) return 1;
        return 0;
    })
}

const PeopleTable: FC<PeopleTableProps> = ({ students, sectionsMap }) => {
    const rowsPerPage = 10;
    const [studentsSorted, setStudentsSorted] = useState<CourseUserData[]>(sortByName(students));
    const [page, setPage] = useState(0);

    useEffect(() => {
        setStudentsSorted(sortByName(students))
    }, [students])

    return (
        <>
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
                                <TableRow key={student.studentID} hover onClick={() => { }}>
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