import { Stack, Typography } from "@mui/material";
import { Course } from "model/course";
import Grid from "@mui/material/Unstable_Grid2";
import CourseHeader from "../CourseHeader";

export interface CourseStudentViewProps {
    course: Course;
}

export function CourseStudentView({ course }: CourseStudentViewProps) {
    return (
        <Stack paddingTop={12} gap={4}>
            <Grid container spacing={2}>
                <Grid xs={2}></Grid>
                <Grid xs={10}>
                    <CourseHeader course={course} />
                </Grid>
            </Grid>
        </Stack>
    );
}