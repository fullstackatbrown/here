import ViewHeaderContent from "@components/shared/ViewHeader/ViewHeaderContent";
import { Stack } from "@mui/material";
import { Course } from "model/course";
import { AdminViews, StaffViews, StudentViews, View } from "model/general";
import { CoursePermission } from "model/user";

interface ViewHeaderProps {
    view: View;
    display?: string;
    endElement?: JSX.Element;
    access: CoursePermission;
    course: Course;
}

export default function ViewHeader({ view, display, endElement, course, access }: ViewHeaderProps) {
    const studentViews = course.config.sharePeopleListWithStudents ? StudentViews : StudentViews.filter(v => v !== "people")
    return <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap"
        justifyContent="space-between"
        mb={1}
        minHeight={40}
        sx={display && { display: display }}
    >
        {access === CoursePermission.CourseAdmin && <ViewHeaderContent view={view} views={AdminViews} />}
        {access === CoursePermission.CourseStaff && <ViewHeaderContent view={view} views={StaffViews} />}
        {access === CoursePermission.CourseStudent && <ViewHeaderContent view={view} views={studentViews} />}
        {endElement}
    </Stack>
}