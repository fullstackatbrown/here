import { ExpandMore } from "@mui/icons-material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {
    Box,
    Button,
    Collapse,
    Stack,
    Typography
} from "@mui/material";
import { filterAssignmentsByReleaseDate } from "@util/shared/assignments";
import listToMap from "@util/shared/listToMap";
import { useAssignments } from "api/assignment/hooks";
import { useSwapsByStudent } from "api/swaps/hooks";
import { Assignment } from "model/assignment";
import { Course } from "model/course";
import { Section } from "model/section";
import { User } from "model/user";
import { useEffect, useState } from "react";
import StudentGradesTable from "./Grades/StudentGradesTable";
import StudentRequestsList from "./Requests/StudentRequestsList";
import SwapRequestDialog from "./Requests/SwapRequestDialog";

export interface StudentViewListProps {
    course: Course;
    sectionsMap: Record<string, Section>;
    student: User;
}

export default function StudentViewList({ course, sectionsMap, student }: StudentViewListProps) {
    const [assignments, assignmentsLoading] = useAssignments(course.ID)
    const [requests, requestsLoading] = useSwapsByStudent(course.ID, student.ID);
    const [requestsOpen, setRequestsOpen] = useState(!requestsLoading && !assignmentsLoading);
    const [gradesOpen, setGradesOpen] = useState(!assignmentsLoading);
    const [swapRequestDialog, setSwapRequestDialog] = useState(false)

    useEffect(() => {
        setGradesOpen(!assignmentsLoading)
        setRequestsOpen(!requestsLoading && !assignmentsLoading)
    }, [assignmentsLoading, requestsLoading, assignmentsLoading])

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
                        <Typography mt={1}>Your instructor has not released any assignments yet</Typography>}
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
                    {assignments && <StudentRequestsList course={course} student={student} requests={requests} sectionsMap={sectionsMap}
                        assignmentsMap={listToMap(assignments) as Record<string, Assignment>} />}
                </Collapse>

            </Stack >
        </>
    );
}
