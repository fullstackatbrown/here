import ViewHeader from "@components/shared/ViewHeader/ViewHeader";
import { Stack } from "@mui/material";
import { View } from "model/general";
import { CoursePermission } from "model/user";

interface StudentViewHeaderProps {
    view: View;
    display?: string;
    endElement?: JSX.Element;
}

export default function StudentViewHeader({ view, display, endElement }: StudentViewHeaderProps) {
    return <Stack direction="row" justifyContent="space-between" mb={1} alignItems="center" height={40} sx={display && { display: display }}>
        <ViewHeader view={view} views={["home", "my requests", "settings", "surveys"]} access={CoursePermission.CourseStudent} />
        {endElement}
    </Stack>
}