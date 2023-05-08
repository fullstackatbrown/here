import ViewHeader from "@components/shared/ViewHeader/ViewHeader";
import { Stack } from "@mui/material";
import { AdminViews, View } from "model/general";
import { CoursePermission } from "model/user";

interface AdminViewHeaderProps {
    view: View;
    access: CoursePermission;
    endElement?: JSX.Element;
}

export default function AdminViewHeader({ view, access, endElement }: AdminViewHeaderProps) {
    return <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap"
        justifyContent="space-between" mb={1}
        minHeight={40}
    >
        <ViewHeader view={view} views={AdminViews} access={access} />
        {endElement}
    </Stack>
}