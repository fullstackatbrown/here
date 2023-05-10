import CourseStatusChip from "@components/shared/CourseStatusChip/CourseStatusChip";
import { Box, Divider, Grid, Stack, Typography } from "@mui/material";
import { capitalizeWords } from "@util/shared/string";
import { Course } from "model/course";
import { FC } from "react";
import CourseActions from "./CourseActions";
import { CoursePermission } from "model/user";
import UserAccessChip from "@components/home/CourseCard/UserAccessChip";

export interface CourseListItemProps {
    course: Course;
    access: CoursePermission;
}

const CourseListItem: FC<CourseListItemProps> = ({ course, access }) => {
    return (
        <Grid
            container
            display="flex"
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "start", sm: "center" }}
        >
            <Grid item xs={12} md={10.5}>
                <Stack direction="row" display="inline-block" sx={{ verticalAlign: "middle" }} mb={1}>
                    <Typography display="inline-block" sx={{ verticalAlign: "middle" }}>
                        {course.code}: {course.title}&nbsp;&nbsp;
                        <Stack direction="row" display="inline-block" spacing={.5}>
                            <CourseStatusChip status={course.status} />
                            <UserAccessChip access={access} variant="outlined" />
                        </Stack>
                    </Typography>
                </Stack>
                <Typography color="secondary" fontSize={14}>{capitalizeWords(course.term)}</Typography>
            </Grid>

            <Grid item xs={12} md={1.5} display="flex" direction="row" width="100%" justifyContent="flex-end" mt={{ xs: -1, md: 0 }}>
                {access === CoursePermission.CourseAdmin && <CourseActions course={course} />}
            </Grid>
        </Grid >
    );
};

export default CourseListItem;


