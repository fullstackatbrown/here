import ViewHeader from "@components/shared/ViewHeader/ViewHeader";
import { Stack } from "@mui/material";
import { StudentViews, View } from "model/general";
import { CoursePermission } from "model/user";

interface StudentViewHeaderProps {
    view: View;
    display?: string;
    endElement?: JSX.Element;
}

export default function StudentViewHeader({ view, display, endElement }: StudentViewHeaderProps) {
    return <Stack direction="row" justifyContent="space-between" mb={1} alignItems="center" height={40} sx={display && { display: display }}>
        <ViewHeader view={view} views={StudentViews} access={CoursePermission.CourseStudent} />
        {endElement}
    </Stack>
}