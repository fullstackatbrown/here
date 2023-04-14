
import CourseAdminView from "@components/course/CourseAdminView/CourseAdminView";
import CourseHeader from "@components/course/CourseHeader";
import CourseStudentView from "@components/course/CourseStudentView/CourseStudentView";
import AppLayout from "@components/shared/AppLayout";
import { Grid, Stack, useTheme } from "@mui/material";
import { useAuth } from "api/auth/hooks";
import { useCourse } from "api/course/hooks";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function CoursePage() {
  const router = useRouter();
  const { currentUser, isAuthenticated } = useAuth();
  const { courseID } = router.query;
  const [course, courseLoading] = useCourse(courseID as string);

  const access = currentUser && currentUser.permissions?.[courseID as string];

  // Redirect user back to home page if no course with given ID is found
  useEffect(() => {
    if (router.isReady && !courseLoading && !course) {
      router
        .push("/")
        .then(() =>
          toast.error("We couldn't find the course you were looking for.")
        );
    }
  }, [router, course, courseLoading]);

  return (
    <AppLayout title={course?.title} maxWidth="lg" loading={courseLoading}>
      {course && !courseLoading &&
        <Stack pt={8} gap={4}>
          <Grid container>
            <Grid item xs={2} />
            <Grid item xs={10}>
              <CourseHeader course={course} />
            </Grid>
          </Grid>
          {access ?
            <CourseAdminView course={course} access={access} /> :
            <CourseStudentView course={course} assignmentsMap={undefined} sectionsMap={undefined} student={undefined} />}
        </Stack>
      }
    </AppLayout>

  );
}
