import GradeChip from '@components/shared/GradeChip/GradeChip';
import { ClickAwayListener } from '@mui/base';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton, Stack, Table, TableBody, TableHead, TableRow, Typography } from '@mui/material';
import MuiTableCell from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import { arraySubtract, arrayUnion } from '@util/shared/array';
import getStudentsInSection from '@util/shared/getStudentsInSection';
import GradeAPI from 'api/grades/api';
import { useGrades } from 'api/grades/hooks';
import { Assignment } from 'model/assignment';
import { Course } from 'model/course';
import { Section } from 'model/section';
import { FC, useState } from 'react';
import toast from 'react-hot-toast';

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
    const [editGrade, setEditGrade] = useState<string | null>(null) // userid

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

    const handleSubmitGrade = (userID: string) => {
        return (grade: number) => {
            toast.promise(GradeAPI.createGrade(course.ID, assignment.ID, userID, grade, "temp_ta_id"),
                {
                    loading: "Submitting grade...",
                    success: "Grade submitted!",
                    error: "Error submitting grade"
                })
                .then(() => setEditGrade(null))
                .catch(() => setEditGrade(null))
        }
    }

    const handleUpdateGrade = (gradeID: string, userID: string) => {
        return (grade: number) => {
            toast.promise(GradeAPI.updateGrade(course.ID, assignment.ID, gradeID, userID, grade, "temp_ta_id"),
                {
                    loading: "Updating grade...",
                    success: "Grade updated!",
                    error: "Error updating grade"
                })
                .then(() => setEditGrade(null))
                .catch(() => setEditGrade(null))
        }
    }

    const handleDeleteGrade = (gradeID: string) => {
        return () => {
            toast.promise(GradeAPI.deleteGrade(course.ID, assignment.ID, gradeID),
                {
                    loading: "Deleting grade...",
                    success: "Grade deleted",
                    error: "Error deleting grade"
                })
                .then(() => setEditGrade(null))
                .catch(() => setEditGrade(null))
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
            </Stack>
            <Table>
                <colgroup>
                    <col width="40%" />
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
                        {getStudents().map((userID) => {
                            const grade = grades && userID in grades ? grades[userID] : undefined
                            return <TableRow hover key={userID} onClick={() => setEditGrade(userID)}>
                                <TableCell component="th" scope="row">
                                    {userID}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <GradeChip
                                        score={grade ? grade.grade : undefined}
                                        maxScore={assignment.maxScore}
                                        editable={editGrade && editGrade === userID}
                                        handleCreateGrade={handleSubmitGrade(userID)}
                                        handleUpdateGrade={grade ? handleUpdateGrade(grade.ID, userID) : undefined}
                                        handleDeleteGrade={grade ? handleDeleteGrade(grade.ID) : undefined}
                                    />
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {grade ? grade.gradedBy : "/"}
                                </TableCell>
                            </TableRow>
                        }
                        )}
                    </TableBody>
                </ClickAwayListener>
            </Table>

        </>
    );
}

export default GradingView;