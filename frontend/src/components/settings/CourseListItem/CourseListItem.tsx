import CourseStatusChip from "@components/shared/CourseStatusChip/CourseStatusChip";
import { Stack, Typography } from "@mui/material";
import { capitalizeWords } from "@util/shared/string";
import { Course } from "model/course";
import { FC } from "react";
import CourseActions from "./CourseActions";

export interface CourseListItemProps {
    course: Course;
}

const CourseListItem: FC<CourseListItemProps> = ({ course }) => {
    return (
        <Stack direction="row" display="flex" justifyContent="space-between" alignItems="center">
            <Stack>
                <Stack direction="row" display="flex" alignItems="center" spacing={1}>
                    <Typography>{course.code}: {course.title}</Typography>
                    <CourseStatusChip status={course.status} />
                </Stack>
                <Typography color="secondary" fontSize={14}>{capitalizeWords(course.term)}</Typography>
            </Stack>
            <CourseActions course={course} />
        </Stack>
    );
};

export default CourseListItem;


