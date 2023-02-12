import { Button, Stack } from "@mui/material";

export interface CourseAdminViewNavigationProps {
    setView: (view: "sections" | "checkoff" | "requests") => void;
}

export default function CourseAdminViewNavigation(props: CourseAdminViewNavigationProps) {
    return (
        <Stack>
            <Button variant="text" onClick={() => props.setView("sections")}>Sections</Button>
            <Button variant="text" onClick={() => props.setView("checkoff")}>Checkoff</Button>
            <Button variant="text" onClick={() => props.setView("requests")}>Requests</Button>
        </Stack>
    )
}