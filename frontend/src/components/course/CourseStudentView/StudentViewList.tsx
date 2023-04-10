import { Autorenew, ExpandMore } from "@mui/icons-material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {
    Box,
    Button,
    Collapse,
    Stack,
    Typography
} from "@mui/material";
import { Course } from "model/course";
import { User } from "model/user";
import { useState } from "react";
import StudentRequestsList from "./Requests/StudentRequestsList";
import { useAssignments } from "api/assignment/hooks";
import { filterAssignmentsByReleaseDate } from "@util/shared/assignments";
import StudentGradesTable from "./Grades/StudentGradesTable";
import { Section } from "model/section";
import SwapRequestDialog from "./Requests/SwapRequestDialog";

export interface StudentViewListProps {
    course: Course;
    sectionsMap: Record<string, Section>;
    student: User;
}

export default function StudentViewList({ course, sectionsMap, student }: StudentViewListProps) {
    const [assignments, assignmentsLoading] = useAssignments(course.ID)
    const [requestsOpen, setRequestsOpen] = useState(true);
    const [gradesOpen, setGradesOpen] = useState(true);
    const [swapRequestDialog, setSwapRequestDialog] = useState(false)

    return (
        <>
            <SwapRequestDialog
                open={swapRequestDialog}
                onClose={() => { setSwapRequestDialog(false) }}
                course={course}
                assignments={assignments}
                student={student}
                sectionsMap={sectionsMap}
            />
            <Stack mt={-1}>
                <Stack direction="row" justifyContent="space-between">
                    <Button
                        color="inherit" variant="text" sx={{ fontSize: 17, ml: -4 }}
                        startIcon={gradesOpen ? <ExpandMore /> : <KeyboardArrowRightIcon />}
                        onClick={() => setGradesOpen(!gradesOpen)}
                    >
                        Assignments & Grades
                    </Button>
                </Stack>
                <Collapse in={gradesOpen} timeout="auto" unmountOnExit>
                    {(assignments && filterAssignmentsByReleaseDate(assignments).length > 0) ?
                        <StudentGradesTable course={course} assignments={filterAssignmentsByReleaseDate(assignments)} student={student} sectionsMap={sectionsMap} /> :
                        <Typography>Your instructor has not released any assignments yet</Typography>}
                </Collapse>

                <Box height={40} />

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Button
                        color="inherit" variant="text" sx={{ fontSize: 17, ml: -4 }}
                        startIcon={requestsOpen ? <ExpandMore /> : <KeyboardArrowRightIcon />}
                        onClick={() => setRequestsOpen(!requestsOpen)}
                    >
                        My Requests
                    </Button>
                    {requestsOpen && <Button size="small" onClick={() => setSwapRequestDialog(true)}> + New Request</Button>}
                </Stack>
                <Collapse in={requestsOpen} timeout="auto" unmountOnExit sx={{ ml: -4 }}>
                    <StudentRequestsList course={course} student={student} />
                </Collapse>

            </Stack >
        </>
    );
}
