import ViewHeader from "@components/shared/ViewHeader/ViewHeader";
import { Stack } from "@mui/material";
import { Course } from "model/course";
import { StudentViews, View } from "model/general";

interface StudentViewHeaderProps {
    view: View;
    display?: string;
    endElement?: JSX.Element;
    course: Course;
}

export default function StudentViewHeader({ view, display, endElement, course }: StudentViewHeaderProps) {
    const shownViews = course.config.sharePeopleListWithStudents ? StudentViews : StudentViews.filter(v => v !== "people")
    return <Stack direction="row" justifyContent="space-between" mb={1} alignItems="center" height={40} sx={display && { display: display }}>
        <ViewHeader view={view} views={shownViews} />
        {endElement}
    </Stack>
}