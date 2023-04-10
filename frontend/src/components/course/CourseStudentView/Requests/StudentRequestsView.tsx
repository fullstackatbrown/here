import { ExpandMore } from "@mui/icons-material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {
    Box,
    Button,
    Collapse,
    Stack
} from "@mui/material";
import { useAssignmentsMap } from "api/assignment/hooks";
import { useSectionsMap } from "api/section/hooks";
import { Course } from "model/course";
import { useState } from "react";
import { User } from "model/user";
import RequestsList from "@components/course/CourseAdminView/RequestsView/RequestsList";
import StudentRequestsList from "./StudentRequestsList";

export interface StudentRequestsViewProps {
    course: Course;
    student: User;
}

export default function StudentRequestsView({ course, student }: StudentRequestsViewProps) {
    const [pendingRequestsOpen, setPendingRequestsOpen] = useState(true);
    const [pastRequestsOpen, setPastRequestsOpen] = useState(false);
    const [assignmentsMap, assignmentsMapLoading] = useAssignmentsMap(course.ID);
    const [sectionsMap, sectionsMapLoading] = useSectionsMap(course.ID);

    return (
        <Stack ml={-1} mt={-1}>
            <Stack direction="row" justifyContent="space-between">
                <Button
                    color="inherit" variant="text" sx={{ fontSize: 17 }}
                    startIcon={pendingRequestsOpen ? <ExpandMore /> : <KeyboardArrowRightIcon />}
                    onClick={() => setPendingRequestsOpen(!pendingRequestsOpen)}
                >
                    Pending Requests
                </Button>
            </Stack>
            <Collapse in={pendingRequestsOpen} timeout="auto" unmountOnExit>
                <StudentRequestsList course={course} student={student} assignmentsMap={assignmentsMap} sectionsMap={sectionsMap} type="pending" />
            </Collapse>

            <Box height={10} />
            <Stack direction="row" justifyContent="space-between">
                <Button
                    color="inherit" variant="text" sx={{ fontSize: 17 }}
                    startIcon={pastRequestsOpen ? <ExpandMore /> : <KeyboardArrowRightIcon />}
                    onClick={() => setPastRequestsOpen(!pastRequestsOpen)}
                >
                    Past Requests
                </Button>
            </Stack>
            <Collapse in={pastRequestsOpen} timeout="auto" unmountOnExit>
                <StudentRequestsList course={course} student={student} assignmentsMap={assignmentsMap} sectionsMap={sectionsMap} type="past" />
            </Collapse>
        </Stack >
    );
}
