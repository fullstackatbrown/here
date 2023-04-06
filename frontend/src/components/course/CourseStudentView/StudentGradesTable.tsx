import GradeChip from "@components/shared/GradeChip/GradeChip";
import { Assignment } from "model/assignment";
import { styled } from "@mui/material/styles";
import MuiTableCell from "@mui/material/TableCell";
import { Table, TableHead, TableRow, TableBody, Stack, Box, Chip } from "@mui/material";
import { FC } from "react";
import { User } from "model/user";
import { Section } from "model/section";
import dayjs from "dayjs";
import { filterAssignmentsByReleaseDate } from "@util/shared/assignments";

interface StudentGradesTableProps {
    assignments: Assignment[];
    student: User;
    sections: Section[];
}

const TableCell = styled(MuiTableCell)(({ theme }) => ({
    ":first-of-type": {
        paddingLeft: 0,
    },
    ":last-of-type": {
        width: 100,
        maxWidth: 100,
        overflow: "hidden",
    },
}))

const StudentGradesTable: FC<StudentGradesTableProps> = ({ assignments, student }) => {

    const getScores = (assignment: Assignment) => {
        const gradeID = assignment.gradesByStudent[student.ID];
        // TODO: get grade from gradeID
    }

    // TODO: firestore listener function to get all grades for this student, for a class

    return <Table>
        <TableHead>
            <TableRow>
                <TableCell>Assignment</TableCell>
                <TableCell>Due</TableCell>
                <TableCell>Section</TableCell>
                <TableCell>Grade</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {filterAssignmentsByReleaseDate(assignments).map((assignment) => (
                <TableRow key={assignment.ID}>
                    <TableCell component="th" scope="row">
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Box>{assignment.name}</Box>
                            {assignment.optional && <Chip label="optional" variant="outlined" size="small" color="primary" />}
                        </Stack>
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {dayjs(assignment.dueDate).format("MMM D, YYYY")}
                    </TableCell>
                    <TableCell component="th" scope="row">

                        {/* {student.actualSection[assignment.courseID][assignment.ID]} */}
                        Section name
                    </TableCell>
                    <TableCell component="th" scope="row" >
                        <GradeChip score={1} maxScore={assignment.maxScore} />
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>

}

export default StudentGradesTable;