import CourseCard from "@components/home/CourseCard";
import AddCourseCard from "@components/home/CourseCard/AddCourseCard";
import JoinCourseDialog from "@components/home/JoinCourseDialog/JoinCourseDialog";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { useCourses, useCoursesByIDsTerm } from "api/course/hooks";
import sortTerms from "@util/shared/sortTerms";
import AppLayout from "components/shared/AppLayout";
import { useEffect, useState } from "react";
import { useAuth } from "api/auth/hooks";
import { CourseStatus } from "model/course";

export default function Home() {
    const { currentUser, isAuthenticated } = useAuth();
    // This will not include inactive courses
    const [courses, loading] = useCoursesByIDsTerm([...currentUser.courses, ...Object.keys(currentUser.permissions)]);
    const [joinCourseDialog, setJoinCourseDialog] = useState(false);

    // TODO: current term
    const currentTerm = "spring 2023"
    const getTerms = () => {
        let terms = []
        if (courses) {
            terms = sortTerms(Object.keys(courses));
        }
        if (terms.length === 0) { return [currentTerm] }
        if (terms[0] !== currentTerm) {
            terms.unshift(currentTerm);
        }
        return terms;
    }

    return (
        <>
            <JoinCourseDialog open={joinCourseDialog} onClose={() => { setJoinCourseDialog(false) }} />
            <AppLayout maxWidth={false} loading={loading}>
                <Box>
                    {!loading && getTerms().map((term, index) => (
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
                                {courses?.[term]?.map((course) => (
                                    <Grid key={course.code} item xs={12} md={6} lg={4} xl={3}>
                                        <CourseCard course={course} user={currentUser} />
                                    </Grid>
                                ))}
                                {index === 0 && <Grid key={"add_course"} item xs={12} md={6} lg={4} xl={3}>
                                    <AddCourseCard onClick={() => { setJoinCourseDialog(true) }} />
                                </Grid>}
                            </Grid>
                        </Box>
                    ))}
                </Box>
            </AppLayout >
        </>
    );
}
