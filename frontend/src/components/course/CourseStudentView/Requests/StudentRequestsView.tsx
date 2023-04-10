import { ExpandMore } from "@mui/icons-material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {
    Button,
    Collapse,
    Stack
} from "@mui/material";
import { Course } from "model/course";
import { User } from "model/user";
import { useState } from "react";
import StudentRequestsList from "./StudentRequestsList";

export interface StudentRequestsViewProps {
    course: Course;
    student: User;
}

export default function StudentRequestsView({ course, student }: StudentRequestsViewProps) {
    const [requestsOpen, setRequestsOpen] = useState(true);

    return (
        <Stack ml={-1} mt={-1}>
            <Stack direction="row" justifyContent="space-between">
                <Button
                    color="inherit" variant="text" sx={{ fontSize: 17 }}
                    startIcon={requestsOpen ? <ExpandMore /> : <KeyboardArrowRightIcon />}
                    onClick={() => setRequestsOpen(!requestsOpen)}
                >
                    My Requests
                </Button>
            </Stack>
            <Collapse in={requestsOpen} timeout="auto" unmountOnExit>
                <StudentRequestsList course={course} student={student} />
            </Collapse>
        </Stack >
    );
}
