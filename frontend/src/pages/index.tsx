import React, { useState } from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import AppLayout from "components/shared/AppLayout";
import CreateQueueDialog from "components/home/CreateQueueDialog";
import { useAuth } from "util/auth/hooks";
import Button from "components/shared/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import BouncingCubesAnimation from "components/animations/BouncingCubesAnimation";
import CourseCard from "@components/home/CourseCard";
import { useCourses } from "@util/course/hooks";

export default function Home() {
    const { currentUser, isAuthenticated } = useAuth();
    const [courses, loading] = useCourses();
    const [createQueueDialog, setCreateQueueDialog] = useState(false);

    const isTA =
        isAuthenticated &&
        currentUser &&
        currentUser.coursePermissions &&
        Object.keys(currentUser.coursePermissions).length > 0;

    return (
        <AppLayout maxWidth={false} loading={loading}>
            <CreateQueueDialog
                open={createQueueDialog}
                onClose={() => setCreateQueueDialog(false)}
            />
            {courses && courses.length > 0 && isTA && (
                <Box mb={2}>
                    <Button
                        startIcon={<AddCircleIcon />}
                        onClick={() => setCreateQueueDialog(true)}
                    >
                        Create Queue
                    </Button>
                </Box>
            )}
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
                    <BouncingCubesAnimation />
                    <Typography variant="h6">
                        No courses are currently holding hours.
                    </Typography>
                    {isTA && (
                        <Button
                            startIcon={<AddCircleIcon />}
                            onClick={() => setCreateQueueDialog(true)}
                        >
                            Create Queue
                        </Button>
                    )}
                </Stack>
            )}
        </AppLayout>
    );
}
