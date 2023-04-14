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
    assignmentsMap: Record<string, Assignment>;
    student: User;
}

export default function StudentViewList({ course, sectionsMap, assignmentsMap, student }: StudentViewListProps) {
    const assignments = Object.values(assignmentsMap);
    const [requests, requestsLoading] = useSwapsByStudent(course.ID, student.ID);
    const [requestsOpen, setRequestsOpen] = useState(!requestsLoading);
    const [gradesOpen, setGradesOpen] = useState(true);
    const [swapRequestDialog, setSwapRequestDialog] = useState(false)

    useEffect(() => {
        setRequestsOpen(!requestsLoading)
    }, [requestsLoading])

    return (
        <>
            <SwapRequestDialog
                open={swapRequestDialog}
                onClose={() => { setSwapRequestDialog(false) }}
                {...{ course, assignments, sectionsMap, student }}
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
                        <StudentGradesTable assignments={filterAssignmentsByReleaseDate(assignments)} {...{ course, sectionsMap, student }} /> :
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
                    <StudentRequestsList {...{ course, sectionsMap, student, assignmentsMap, requests }} />
                </Collapse>

            </Stack >
        </>
    );
}
