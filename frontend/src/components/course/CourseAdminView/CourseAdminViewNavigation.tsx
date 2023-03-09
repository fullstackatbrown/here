import { Button, Stack } from "@mui/material";
import { Views } from "model/general";

export interface CourseAdminViewNavigationProps {
    setView: (view: Views) => void;
}

export default function CourseAdminViewNavigation(props: CourseAdminViewNavigationProps) {
    return (
        <Stack alignItems="start">
            <Button variant="text" onClick={() => props.setView("sections")}>Sections</Button>
            <Button variant="text" onClick={() => props.setView("assignments")}>Assignments</Button>
            <Button variant="text" onClick={() => props.setView("people")}>People</Button>
            <Button variant="text" onClick={() => props.setView("requests")}>Requests</Button>
        </Stack>
    )
}