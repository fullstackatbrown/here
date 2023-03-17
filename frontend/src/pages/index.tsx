import CourseCard from "@components/home/CourseCard";
import AddCourseCard from "@components/home/CourseCard/AddCourseCard";
import JoinCourseDialog from "@components/home/CreateCourseDialog/CreateCourseDialog";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { useCourses } from "@util/course/hooks";
import sortTerms from "@util/shared/sortTerms";
import AppLayout from "components/shared/AppLayout";
import { useState } from "react";
import { useAuth } from "util/auth/hooks";

export default function Home() {
    const { currentUser, isAuthenticated } = useAuth();
    const [coursesByTerm, loading] = useCourses();
    const [joinCourseDialog, setJoinCourseDialog] = useState(false);

    const getTerms = () => {
        if (coursesByTerm) {
            return sortTerms(Object.keys(coursesByTerm));
        }
        return [];
    }

    const isTA =
        isAuthenticated &&
        currentUser &&
        currentUser.coursePermissions &&
        Object.keys(currentUser.coursePermissions).length > 0;

    return (
        <>
            <JoinCourseDialog open={joinCourseDialog} onClose={() => { setJoinCourseDialog(false) }} />
            <AppLayout maxWidth={false} loading={loading}>
                {coursesByTerm && Object.keys(coursesByTerm).length > 0 && (
                    <Box>
                        {/* TODO: add a global value for current term instead of using index */}
                        {getTerms().map((term, index) => (
                            <Box key={term} my={4}>
                                <Typography variant="body1" my={1} ml={0.5} sx={{ fontWeight: 500 }}>
                                    {term}
                                </Typography>
                                <Grid
                                    spacing={3}
                                    container
                                    direction="row"
                                    alignItems="stretch"
                                >
                                    {
                                        coursesByTerm[term].map((course) => (
                                            <Grid key={course.code} item xs={12} md={6} lg={4} xl={3}>
                                                <CourseCard course={course} />
                                            </Grid>
                                        ))
                                    }
                                    {index === 0 && <Grid key={"add_course"} item xs={12} md={6} lg={4} xl={3}>
                                        <AddCourseCard onClick={() => { setJoinCourseDialog(true) }} />
                                    </Grid>}
                                </Grid>
                            </Box>
                        ))}
                    </Box>
                )
                }
                {
                    coursesByTerm && Object.keys(coursesByTerm).length === 0 && (
                        <Stack
                            mt={4}
                            spacing={2}
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Typography variant="h6">
                                You are not enrolled in any course yet.
                            </Typography>
                        </Stack>
                    )
                }
            </AppLayout >
        </>
    );
}
