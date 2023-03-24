import GradeChip from '@components/shared/GradeChip/GradeChip';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { FormControl, IconButton, InputLabel, Select, Stack, Table, TableBody, TableHead, TableRow, Typography } from '@mui/material';
import { styled } from "@mui/material/styles";
import MuiTableCell from "@mui/material/TableCell";
import { Assignment } from 'model/assignment';
import { Course } from 'model/course';
import { FC, useState } from 'react';

interface GradingViewProps {
    course: Course;
    assignment: Assignment;
    handleNavigateBack: () => void;
}

const TableCell = styled(MuiTableCell)(({ theme }) => ({
    ":first-of-type": {
        paddingLeft: 0,
    },
    ":last-of-type": {
        width: 120,
        maxWidth: 120,
        overflow: "hidden",
    },
}))

const GradingView: FC<GradingViewProps> = ({ course, assignment, handleNavigateBack }) => {
    const [selectedSection, setSelectedSection] = useState<string | null>(null)

    const getStudents = () => {
        if (!selectedSection) {
            return []
            // return Object.keys(course.students)
        } else {

        }
    }

    return (
        <>
            <Stack direction="row" justifyContent="space-between" mb={1}>
                <Stack direction="row" spacing={2}>
                    <Typography variant="h6" fontWeight={600}>
                        {assignment.name}
                    </Typography>
                    <IconButton size="small" onClick={handleNavigateBack}>
                        <ArrowBackIcon />
                    </IconButton>
                </Stack>
                <FormControl variant="standard">
                    {/* <InputLabel id="section-select-label">Assignment</InputLabel> */}
                    <Select
                        // labelId="assignment-select-label"
                        label="Assignment"
                        required
                    >
                        {/* <MenuItem key={`select-assignment-${a.ID}`} value={a.ID}>{a.name}</MenuItem> */}
                    </Select>
                </FormControl>
            </Stack>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Student</TableCell>
                        <TableCell>Grade</TableCell>
                        <TableCell>Graded by</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {getStudents().map((studentID, id) =>
                        <TableRow key={studentID}>
                            <TableCell component="th" scope="row">
                                NAME
                            </TableCell>
                            <TableCell component="th" scope="row">
                                <GradeChip score={1} maxScore={assignment.maxScore} />
                            </TableCell>
                            <TableCell component="th" scope="row">
                                Graded by
                            </TableCell>
                        </TableRow>
                    )}

                </TableBody>
            </Table>

        </>
    );
}

export default GradingView;