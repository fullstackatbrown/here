import CourseAdminView from "@components/course/CourseAdminView/CourseAdminView";
import DesktopNavigation from "@components/course/CourseAdminView/Navigation/Desktop/DesktopNavigation";
import CourseHeader from "@components/course/CourseHeader";
import CourseStudentView from "@components/course/CourseStudentView/CourseStudentView";
import AppLayout from "@components/shared/AppLayout";
import { Box, Grid, Stack, useTheme } from "@mui/material";
import { useAuth } from "api/auth/hooks";
import { useCourse } from "api/course/hooks";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useInView } from "react-intersection-observer";

export default function CoursePage() {
  const router = useRouter();
  const { currentUser, isAuthenticated } = useAuth();
  const { courseID } = router.query;
  const [course, courseLoading] = useCourse(courseID as string);
  const { ref, inView } = useInView({ threshold: 1 });

  const access = currentUser && currentUser.permissions?.[courseID as string];
  const theme = useTheme();

  // Redirect user back to home page if no course with given ID is found
  useEffect(() => {
    if (router.isReady && !courseLoading && !course) {
      router.push("/").then(() => toast.error("We couldn't find the course you were looking for."));
    }
  }, [router, course, courseLoading]);

  return (
    <AppLayout title={course?.title} maxWidth="lg" loading={courseLoading}>
      {course && !courseLoading && (
        <Grid container>
          <Grid
            xs={0.5}
            sm={1}
            md={2.2}
            pl={2}
            pt={20}
          >
            <DesktopNavigation access={access} headerInView={inView} courseCode={course.code} />
          </Grid>
          <Grid xs>
            <Stack spacing={4} pt={4}>
              <CourseHeader intersectionRef={ref} course={course} />
              {access ? <CourseAdminView headerInView={inView} course={course} access={access} /> :
                <CourseStudentView course={course} student={currentUser} />}
            </Stack>

          </Grid>
          <Grid
            xs={0.5}
            sm={router.query.view === "requests" ? 0.5 : 1}
            md={router.query.view === "requests" ? 0.5 : 2.2}
          />
        </Grid>

      )}
    </AppLayout>
  );
}
