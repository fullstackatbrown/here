import GradeChip from '@components/shared/GradeChip/GradeChip';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { FormControl, IconButton, InputLabel, Select, Stack, Table, TableBody, TableHead, TableRow, Typography } from '@mui/material';
import { styled } from "@mui/material/styles";
import MuiTableCell from "@mui/material/TableCell";
import { arraySubtract, arrayUnion } from '@util/shared/array';
import getStudentsInSection from '@util/shared/getStudentsInSection';
import { useGrades } from 'api/grades/hooks';
import { useStudentsByIDs } from 'api/users/hooks';
import { Assignment } from 'model/assignment';
import { Course } from 'model/course';
import { Grade } from 'model/grades';
import { Section } from 'model/section';
import { ClickAwayListener } from '@mui/base';
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
    const [grades, loading] = useGrades(course.ID, assignment.ID)
    const [editGrade, setEditGrade] = useState<Grade | null>(null)
    // const [students, studentsLoading] = useStudentsByIDs(Object.keys(course.students || {}))

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
                <colgroup>
                    <col width="30%" />
                    <col width="30%" />
                    <col width="30%" />
                </colgroup>
                <TableHead>
                    <TableRow>
                        <TableCell>Student</TableCell>
                        <TableCell>Grade</TableCell>
                        <TableCell>Graded by</TableCell>
                    </TableRow>
                </TableHead>
                <ClickAwayListener onClickAway={() => setEditGrade(null)}>
                    <TableBody>
                        {grades && grades.map((grade) => {
                            return <TableRow hover key={grade.ID} onClick={() => setEditGrade(grade)}>
                                <TableCell component="th" scope="row">
                                    {grade.studentID}
                                    {/* {user.displayName} */}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <GradeChip
                                        score={grade ? grade.grade : undefined}
                                        maxScore={assignment.maxScore}
                                        editable={editGrade && editGrade.ID === grade.ID}
                                    />
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {grade ? grade.gradedBy : "/"}
                                </TableCell>
                            </TableRow>
                        }
                        )}
                        {/* {students && students.map((user) => {
                        const grade = grades && user.ID in grades ? grades[user.ID] : undefined
                        // const gradeID = getGradeByStudent(user.ID)
                        return <TableRow key={user.ID} hover>
                            <TableCell component="th" scope="row">
                                {user.displayName}
                            </TableCell>
                            <TableCell component="th" scope="row">
                                <GradeChip score={grade ? grade.grade : undefined} maxScore={assignment.maxScore} />
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {grade ? grade.gradedBy : "/"}
                            </TableCell>
                        </TableRow>
                    }
                    )} */}
                    </TableBody>
                </ClickAwayListener>
            </Table>

        </>
    );
}

export default GradingView;