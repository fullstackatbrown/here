import ViewHeader from "@components/shared/ViewHeader/ViewHeader";
import { Stack } from "@mui/material";
import { View } from "model/general";
import { CoursePermission } from "model/user";

interface AdminViewHeaderProps {
    view: View;
    access: CoursePermission;
    endElement?: JSX.Element;
}

export default function AdminViewHeader({ view, access, endElement }: AdminViewHeaderProps) {
    return <Stack direction="row" justifyContent="space-between" mb={1} alignItems="center" height={40}>
        <ViewHeader view={view} views={["sections", "assignments", "people", "requests", "settings"]} access={access} />
        {endElement}
    </Stack>
}