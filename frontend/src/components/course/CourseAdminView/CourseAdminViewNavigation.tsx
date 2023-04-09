import { Button, Stack } from "@mui/material";
import { View } from "model/general";
import { useRouter } from "next/router";

export default function CourseAdminViewNavigation() {
    const router = useRouter();

    function navigateTo(view: View) {
        return () => {
            router.push(`${router.query.courseID}?view=${view}`, undefined, { shallow: true })
        }
    }

    return (
        <Stack alignItems="start">
            <Button variant="text" onClick={navigateTo("sections")}>Sections</Button>
            <Button variant="text" onClick={navigateTo("assignments")}>Assignments</Button>
            <Button variant="text" onClick={navigateTo("people")}>People</Button>
            <Button variant="text" onClick={navigateTo("requests")}>Requests</Button>
            {/* TODO: make settings only visible to admin, add a divider here?,  */}
            <Button variant="text" onClick={navigateTo("settings")}>Settings</Button>
        </Stack>
    )
}