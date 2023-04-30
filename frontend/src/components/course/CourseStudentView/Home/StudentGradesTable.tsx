import GradeChip from "@components/shared/GradeChip/GradeChip";
import { Box, Chip, Stack, Table, TableBody, TableHead, TableRow } from "@mui/material";
import MuiTableCell from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
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

const TableCell = styled(MuiTableCell)(({ theme }) => ({
    padding: theme.spacing(1),
    ":first-of-type": {
        paddingLeft: 0,
    },
    ":last-of-type": {
        paddingRight: 0,
    },
}))

const StudentGradesTable: FC<StudentGradesTableProps> = ({ course, student, assignments, sectionsMap, instructor = false }) => {
    const assignmentsDisplayed = instructor ? sortAssignments(assignments) : sortAssignments(filterAssignmentsByReleaseDate(assignments))

    const getSectionInfo = (assignmentID: string): string => {
        let sectionID = student.actualSections?.[course.ID]?.[assignmentID]
        if (sectionID) return formatSectionInfo(sectionsMap[sectionID], true)

        sectionID = student.defaultSections?.[course.ID]
        if (sectionID) return "Regular"

        return "Unassigned"
    }

    return <Table sx={{ marginTop: 1 }}>
        <colgroup>
            <col width="35%" />
            <col width="18%" />
            <col width="18%" />
            <col width="34%" />
        </colgroup>
        <TableHead>
            <TableRow>
                <TableCell>Assignment</TableCell>
                <TableCell>Due</TableCell>
                <TableCell>Grade</TableCell>
                <TableCell>Section</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {assignmentsDisplayed.map((assignment) => {
                return <TableRow key={assignment.ID}>
                    <TableCell component="th" scope="row">
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Box>{assignment.name}</Box>
                            {assignment.optional && <Chip label="optional" variant="outlined" size="small" color="primary" />}
                        </Stack>
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {dayjs(assignment.dueDate).format("MMM D, YYYY")}
                    </TableCell>
                    <TableCell component="th" scope="row" >
                        <GradeChip
                            score={assignment.grades?.[student.ID]?.grade}
                            maxScore={assignment.maxScore}
                            readOnly={true}
                        />
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {getSectionInfo(assignment.ID)}
                    </TableCell>
                </TableRow>
            })}
        </TableBody>
    </Table>

}

export default StudentGradesTable;