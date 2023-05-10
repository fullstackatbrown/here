import CourseCard from "@components/home/CourseCard";
import AddCourseCard from "@components/home/CourseCard/AddCourseCard";
import JoinCourseDialog from "@components/home/JoinCourseDialog/JoinCourseDialog";
import { Box, Grid, Typography } from "@mui/material";
import { capitalizeWords } from "@util/shared/string";
import { getCurrentTerm, getTerms } from "@util/shared/terms";
import { useAuth } from "api/auth/hooks";
import { useCoursesByIDsTerm } from "api/course/hooks";
import AppLayout from "components/shared/AppLayout";
import { useEffect } from "react";
import { useMemo, useState } from "react";

export default function Home() {
    const { currentUser, isAuthenticated } = useAuth();
    const coursesToDisplay = useMemo(() =>
        currentUser && isAuthenticated ? [...currentUser.courses, ...Object.keys(currentUser.permissions)] : [],
        [currentUser, isAuthenticated])
    // This hook will not include inactive courses
    const [courses, loading] = useCoursesByIDsTerm(coursesToDisplay);
    const [joinCourseDialog, setJoinCourseDialog] = useState(false);

    return (
        <>
            <JoinCourseDialog open={joinCourseDialog} onClose={() => { setJoinCourseDialog(false) }} />
            <AppLayout maxWidth={false} loading={loading}>
                <Box>
                    {!loading && getTerms(courses).map((term, index) => (
                        <Box key={term} my={4}>
                            <Typography variant="body1" my={1} ml={0.5} sx={{ fontWeight: 500 }}>
                                {capitalizeWords(term)}
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
                                {term === getCurrentTerm() && <Grid key={"add_course"} item xs={12} md={6} lg={4} xl={3}>
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
