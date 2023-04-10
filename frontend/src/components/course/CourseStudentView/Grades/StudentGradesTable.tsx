import GradeChip from "@components/shared/GradeChip/GradeChip";
import { Box, Chip, Stack, Table, TableBody, TableHead, TableRow } from "@mui/material";
import MuiTableCell from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import { sortAssignments } from "@util/shared/assignments";
import formatSectionInfo from "@util/shared/formatSectionInfo";
import { useGradesForStudent } from "api/grades/hooks";
import dayjs from "dayjs";
import { Assignment } from "model/assignment";
import { Course } from "model/course";
import { Section } from "model/section";
import { User } from "model/user";
import { FC } from "react";

interface StudentGradesTableProps {
    course: Course;
    assignments: Assignment[];
    student: User;
    sectionsMap: Record<string, Section>;
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

const StudentGradesTable: FC<StudentGradesTableProps> = ({ course, assignments, student, sectionsMap }) => {
    const [grades, gradesLoading] = useGradesForStudent(course.ID, student.ID)

    const getSection = (assignmentID: string): Section => {
        let sectionID = student.actualSection?.[course.ID]?.[assignmentID]
        if (sectionID) return sectionsMap[sectionID]

        sectionID = student.defaultSection?.[course.ID]
        if (sectionID) return sectionsMap[sectionID]

        return undefined
    }

    return <Table sx={{ marginTop: 1 }}>
        <colgroup>
            <col width="35%" />
            <col width="20%" />
            <col width="30%" />
            <col width="15%" />
        </colgroup>
        <TableHead>
            <TableRow>
                <TableCell>Assignment</TableCell>
                <TableCell>Due</TableCell>
                <TableCell>Section</TableCell>
                <TableCell>Grade</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {sortAssignments(assignments).map((assignment) => {
                const section = sectionsMap && getSection(assignment.ID)
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
                    <TableCell component="th" scope="row">
                        {section ? formatSectionInfo(section, true) : "Unassigned"}
                    </TableCell>
                    <TableCell component="th" scope="row" >
                        <GradeChip
                            score={grades && grades[assignment.ID]?.grade}
                            maxScore={assignment.maxScore}
                            instructor={false}
                        />
                    </TableCell>
                </TableRow>
            })}
        </TableBody>
    </Table>

}

export default StudentGradesTable;