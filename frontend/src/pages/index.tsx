import React, { useState } from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import AppLayout from "components/shared/AppLayout";
import { useAuth } from "util/auth/hooks";
import Button from "components/shared/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CourseCard from "@components/home/CourseCard";
import { useCourses } from "@util/course/hooks";

export default function Home() {
    const { currentUser, isAuthenticated } = useAuth();
    const [courses, loading] = useCourses();

    const isTA =
        isAuthenticated &&
        currentUser &&
        currentUser.coursePermissions &&
        Object.keys(currentUser.coursePermissions).length > 0;

    return (
        <AppLayout maxWidth={false} loading={loading}>
            {courses && courses.length > 0 && (
                <Grid
                    spacing={3}
                    container
                    direction="row"
                    alignItems="stretch"
                >
                    {courses.map((course) => (
                        <Grid key={course.code} item xs={12} md={6} lg={4} xl={3}>
                            <CourseCard course={course} />
                        </Grid>
                    ))}
                </Grid>
            )}
            {courses && courses.length === 0 && (
                <Stack
                    mt={4}
                    spacing={2}
                    justifyContent="center"
                    alignItems="center"
                >
                    <Typography variant="h6">
                        No courses are currently holding hours.
                    </Typography>
                </Stack>
            )}
        </AppLayout>
    );
}
