import GradeChip from '@components/shared/GradeChip/GradeChip';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { FormControl, IconButton, InputLabel, Select, Stack, Table, TableBody, TableHead, TableRow, Typography } from '@mui/material';
import { styled } from "@mui/material/styles";
import MuiTableCell from "@mui/material/TableCell";
import { arraySubtract, arrayUnion } from '@util/shared/array';
import getStudentsInSection from '@util/shared/getStudentsInSection';
import { useStudentsByIDs } from 'api/users/hooks';
import { Assignment } from 'model/assignment';
import { Course } from 'model/course';
import { Section } from 'model/section';
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
    const [selectedSection, setSelectedSection] = useState<Section | null>(null)
    const [students, studentsLoading] = useStudentsByIDs(Object.keys(course.students || {}))

    const getStudents = () => {
        if (!selectedSection) {
            return course.students ? Object.keys(course.students) : []
        } else {
            if (!course.students) return []
            let students = getStudentsInSection(course.students, selectedSection.ID)

            // filter out swapped out students
            if (selectedSection.swappedOutStudents && assignment.ID in selectedSection.swappedOutStudents) {
                students = arraySubtract(students, selectedSection.swappedOutStudents[assignment.ID])
            }

            // add in swapped in students
            if (selectedSection.swappedInStudents && assignment.ID in selectedSection.swappedInStudents) {
                students = arrayUnion(students, selectedSection.swappedInStudents[assignment.ID])
            }
            return students
        }
    }

    // const getGradeByStudent = (studentID: string) => {
    //     if (!assignment.gradesByStudent || !(studentID in assignment.gradesByStudent)) {
    //         return null
    //     }
    //     return assignment.gradesByStudent[studentID]
    // }

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
                {/* <FormControl variant="standard">
                    <InputLabel id="section-select-label">Assignment</InputLabel>
                    <Select
                        // labelId="assignment-select-label"
                        label="Assignment"
                        required
                    >
                        <MenuItem key={`select-assignment-${a.ID}`} value={a.ID}>{a.name}</MenuItem>
                    </Select>
                </FormControl> */}
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
                    {students && students.map((user) => {
                        // const gradeID = getGradeByStudent(user.ID)
                        return <TableRow key={user.ID}>
                            <TableCell component="th" scope="row">
                                {user.displayName}
                            </TableCell>
                            <TableCell component="th" scope="row">
                                <GradeChip score={1} maxScore={assignment.maxScore} />
                            </TableCell>
                            <TableCell component="th" scope="row">
                                Graded by
                            </TableCell>
                        </TableRow>
                    }
                    )}
                </TableBody>
            </Table>

        </>
    );
}

export default GradingView;