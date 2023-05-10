import { Box, CircularProgress, Divider, Paper, Stack, Typography } from "@mui/material";
import { sortCoursesByTerm } from "@util/shared/terms";
import { useCoursesByIDs } from "api/course/hooks";
import { CoursePermission, User } from "model/user";
import { FC, useMemo } from "react";
import CourseListItem from "../CourseListItem/CourseListItem";
import { CourseStatus } from "model/course";

export interface YourCoursesSectionProps {
    user: User;
}

const YourCoursesSection: FC<YourCoursesSectionProps> = ({ user }) => {
    const courseIDs = useMemo(() => user ? [...user.courses, ...Object.keys(user.permissions)] : [], [user])
    const [courses, loading] = useCoursesByIDs(courseIDs);
    return <Paper variant="outlined">
        <Stack p={3} spacing={2}>
            <Typography variant="h6" fontWeight={600}>Your Courses</Typography>
            {courses ?
                <Stack spacing={3}>
                    {
                        sortCoursesByTerm(courses).map((course, index) => {
                            const access = user.permissions?.[course.ID] as CoursePermission || CoursePermission.CourseStudent
                            if (access === CoursePermission.CourseStudent && course.status === CourseStatus.CourseInactive) return <></>
                            return <Stack spacing={1.5} key={course.ID}>
                                <CourseListItem {...{ course, access }} />
                                {index < courses.length - 1 && <Divider />}
                            </Stack>
                        })
                    }
                </Stack> :
                <Box textAlign="center" py={2}>
                    <CircularProgress />
                </Box>
            }
        </Stack>
    </Paper >;
};

export default YourCoursesSection;


