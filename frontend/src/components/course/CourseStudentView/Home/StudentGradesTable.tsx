import GradeChip from "@components/shared/GradeChip/GradeChip";
import { Chip, Divider, Grid, Stack, Typography, useMediaQuery } from "@mui/material";
import { Theme, styled } from "@mui/material/styles";
import { filterAssignmentsByReleaseDate, sortAssignments } from "@util/shared/assignments";
import formatSectionInfo from "@util/shared/formatSectionInfo";
import dayjs from "dayjs";
import { Assignment } from "model/assignment";
import { Course } from "model/course";
import { Section } from "model/section";
import { User } from "model/user";
import { FC } from "react";

interface StudentGradesTableProps {
    course: Course;
    student: User;
    sectionsMap: Record<string, Section>;
    assignments: Assignment[];
    instructor?: boolean;
}


const TableHeader = styled(Typography)(({ theme }) => ({
    fontWeight: 500,
    fontSize: 15
}))

const GridItem = styled(Grid)(({ theme }) => ({
    display: "flex",
    alignItems: "center"
}))


const StudentGradesTable: FC<StudentGradesTableProps> = ({ course, student, assignments, sectionsMap, instructor = false }) => {
    const assignmentsDisplayed = instructor ? sortAssignments(assignments) : sortAssignments(filterAssignmentsByReleaseDate(assignments))
    const isXsScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const getSectionInfo = (assignmentID: string): string => {
        let sectionID = student.actualSections?.[course.ID]?.[assignmentID]
        if (sectionID) return formatSectionInfo(sectionsMap[sectionID], true)

        sectionID = student.defaultSections?.[course.ID]
        if (sectionID) return "Regular"

        return "Unassigned"
    }

    return <Stack direction="column">
        {!isXsScreen &&
            <Grid container my={1}>
                <GridItem item xs={8.8} md={9.8}>
                    <Grid container>
                        <GridItem item xs={12} md={5}>
                            <TableHeader>Assignment</TableHeader>
                        </GridItem>
                        <GridItem item xs={12} md={3}>
                            <TableHeader>Due Date</TableHeader>
                        </GridItem>
                        <GridItem item xs={12} md={4}>
                            <TableHeader>Section</TableHeader>
                        </GridItem>
                    </Grid>
                </GridItem>
                <GridItem item xs={3.2} md={2.2}>
                    <TableHeader>Grade</TableHeader>
                </GridItem>
            </Grid>
        }
        <Divider />
        {assignmentsDisplayed.map((assignment) => (
            <>
                <Grid container my={1}>
                    <GridItem item xs={8.8} md={9.8}>
                        <Grid container>
                            <GridItem item xs={12} md={5}>
                                <Stack display="flex" flexDirection="row" spacing={1} alignItems="center">
                                    <Typography fontSize={15} fontWeight={isXsScreen ? 500 : 400}>
                                        {assignment.name}
                                    </Typography>
                                    {assignment.optional && <Chip label="optional" variant="outlined" size="small" color="primary" />}
                                </Stack>
                            </GridItem>
                            <GridItem item xs={12} md={3}>
                                <Typography fontSize={isXsScreen ? 13.5 : 15}>
                                    {isXsScreen && "Due: "}{dayjs(assignment.dueDate).format("MMM D, YYYY")}
                                </Typography>
                            </GridItem>
                            <GridItem item xs={12} md={4}>
                                <Typography fontSize={isXsScreen ? 13.5 : 15}>
                                    {isXsScreen && "Section: "}{getSectionInfo(assignment.ID)}
                                </Typography>
                            </GridItem>
                        </Grid>
                    </GridItem>
                    <GridItem item xs={3.2} md={2.2}>
                        <GradeChip
                            score={assignment.grades?.[student.ID]?.grade}
                            maxScore={assignment.maxScore}
                            readOnly={true}
                        />
                    </GridItem>
                </Grid>
                <Divider />
            </>
        ))}
    </Stack >

}

export default StudentGradesTable;