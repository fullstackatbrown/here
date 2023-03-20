import { GradeChip } from "@components/shared/GradeChip/GradeChip";
import { Assignment } from "model/assignment";
import { Table, TableHead, TableRow, TableCell, TableBody, Stack, Box, Chip } from "@mui/material";
import { FC } from "react";

interface StudentGradesTableProps {
    assignments: Assignment[];
}

const StudentGradesTable: FC<StudentGradesTableProps> = ({ assignments }) => {
    return <Table>
        <TableHead>
            <TableRow>
                <TableCell sx={{ paddingLeft: 0 }}>
                    {/* <Typography variant="body2">Assignment</Typography> */}
                    Assignment
                </TableCell>
                <TableCell>Due</TableCell>
                <TableCell>Section</TableCell>
                <TableCell>Grade</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {assignments.map((assignment) => (
                <TableRow key={assignment.ID}>
                    <TableCell component="th" scope="row" sx={{ paddingLeft: 0 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Box>{assignment.name}</Box>
                            {assignment.optional && <Chip label="optional" variant="outlined" size="small" color="primary" />}
                        </Stack>
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {assignment.endDate.toLocaleDateString()}
                    </TableCell>
                    <TableCell component="th" scope="row">
                        Section name
                    </TableCell>
                    <TableCell component="th" scope="row">
                        <GradeChip score={1} maxScore={assignment.maxScore} />
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>

}

export default StudentGradesTable;