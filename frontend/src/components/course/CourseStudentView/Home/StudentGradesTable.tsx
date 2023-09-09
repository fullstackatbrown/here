import GradeChip from "@components/shared/GradeChip/GradeChip";
import { Box, Chip, Divider, Grid, Stack, Typography, useMediaQuery } from "@mui/material";
import { Theme, styled } from "@mui/material/styles";
import { filterAssignmentsByReleaseDate, sortAssignments } from "@util/shared/assignments";
import formatSectionInfo from "@util/shared/section";
import dayjs from "dayjs";
import { Assignment } from "model/assignment";
import { Course } from "model/course";
import { Section } from "model/section";
import toast from 'react-hot-toast';
import { User } from "model/user";
import { FC, useState } from "react";
import GradeAPI from "api/grades/api";

interface StudentGradesTableProps {
    course: Course;
    student: User;
    sectionsMap: Record<string, Section>;
    assignments: Assignment[];
    isInstructor?: boolean;
}


const TableHeader = styled(Typography)(({ theme }) => ({
    fontWeight: 500,
    fontSize: 14
}))

const GridItem = styled(Grid)(({ theme }) => ({
    display: "flex",
    alignItems: "center"
}))


const StudentGradesTable: FC<StudentGradesTableProps> = ({ course, student, assignments, sectionsMap, isInstructor = false }) => {
    const assignmentsDisplayed = isInstructor ? sortAssignments(assignments) : sortAssignments(filterAssignmentsByReleaseDate(assignments))
    const isXsScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const getSectionInfo = (assignmentID: string): string => {
        const actualSectionID = student.actualSections?.[course.ID]?.[assignmentID]
        const regularSectionID = student.defaultSections?.[course.ID]

        if (actualSectionID === regularSectionID) return "Regular"
        if (actualSectionID) return formatSectionInfo(sectionsMap[actualSectionID], true)
        if (regularSectionID) return "Regular"
        return "Unassigned"
    }

    const [editingGradeFor, setEditingGradeFor] = useState<string | null>(null) // assignment for which the grade is edited
    const handleSubmitGrade = (assignmentID: string) => {
        return (grade: number) => {
            toast.promise(GradeAPI.createGrade(course.ID, assignmentID, student.ID, grade),
                {
                    loading: "Submitting grade...",
                    success: "Grade submitted!",
                    error: "Error submitting grade"
                })
                .then(() => setEditingGradeFor(null))
                .catch(() => setEditingGradeFor(null))
        }
    }

    const handleDeleteGrade = (assignmentID: string) => {
        return () => {
            toast.promise(GradeAPI.deleteGrade(course.ID, assignmentID, student.ID),
                {
                    loading: "Deleting grade...",
                    success: "Grade deleted",
                    error: "Error deleting grade"
                })
                .then(() => setEditingGradeFor(null))
                .catch(() => setEditingGradeFor(null))
        }
    }

    return <Stack direction="column">
        {!isXsScreen &&
            <Grid container my={1}>
                <GridItem item xs={12} md={4.8}>
                    <TableHeader>Assignment</TableHeader>
                </GridItem>
                <GridItem item xs={8.8} md={5.2}>
                    <Grid container>
                        <GridItem item xs={12} md={4}>
                            <TableHeader>Due Date</TableHeader>
                        </GridItem>
                        <GridItem item xs={12} md={8}>
                            <TableHeader>Section</TableHeader>
                        </GridItem>
                    </Grid>
                </GridItem>
                <GridItem item xs={3.2} md={2}>
                    <TableHeader>Grade</TableHeader>
                </GridItem>
            </Grid>
        }
        <Divider />
        {assignmentsDisplayed.map((assignment) => {
            const grade = assignment.grades?.[student.ID]?.grade;
            return (<Box key={assignment.ID} onClick={() => setEditingGradeFor(assignment.ID)}>
                <Grid container my={1}>
                    <GridItem item xs={12} md={4.8} mb={isXsScreen ? 1 : 0} flexWrap="wrap">
                        <Typography fontSize={14} fontWeight={isXsScreen ? 500 : 400} sx={{ marginRight: 1 }}>
                            {assignment.name}
                        </Typography>
                        {assignment.optional && <Chip label="optional" variant="outlined" size="small" color="primary" />}
                    </GridItem>
                    <GridItem item xs={8.8} md={5.2}>
                        <Grid container>
                            <GridItem item xs={12} md={4}>
                                <Typography fontSize={isXsScreen ? 13.5 : 14}>
                                    {isXsScreen && "Due: "}{dayjs(assignment.dueDate).format("MMM D, YYYY")}
                                </Typography>
                            </GridItem>
                            <GridItem item xs={12} md={8}>
                                <Typography fontSize={isXsScreen ? 13.5 : 14}>
                                    {isXsScreen && "Section: "}{getSectionInfo(assignment.ID)}
                                </Typography>
                            </GridItem>
                        </Grid>
                    </GridItem>
                    <GridItem item xs={3.2} md={2}>
                        {isInstructor ?
                            <GradeChip
                                score={assignment.grades?.[student.ID]?.grade}
                                maxScore={assignment.maxScore}
                                readOnly={false}
                                inEditMode={editingGradeFor && editingGradeFor === assignment.ID}
                                handleCreateGrade={handleSubmitGrade(assignment.ID)}
                                handleDeleteGrade={grade ? handleDeleteGrade(assignment.ID) : undefined}
                            /> : <GradeChip
                                score={assignment.grades?.[student.ID]?.grade}
                                maxScore={assignment.maxScore}
                                readOnly={true}
                            />}
                    </GridItem>
                </Grid>
                <Divider />
            </Box>);
        })}
    </Stack >

}

export default StudentGradesTable;