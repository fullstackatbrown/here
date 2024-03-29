import CourseAdminView from "@components/course/CourseAdminView/CourseAdminView";
import CourseHeader from "@components/course/CourseHeader";
import CourseStudentView from "@components/course/CourseStudentView/CourseStudentView";
import AppLayout from "@components/shared/AppLayout";
import { Grid, Stack } from "@mui/material";
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

  const access = currentUser?.permissions?.[courseID as string];
  const isStudent = currentUser?.courses?.includes(courseID as string);

  useEffect(() => {
    if (router.isReady && !courseLoading && isAuthenticated) {
      if (!course) {
        router.push("/").then(() => toast.error("We couldn't find the course you were looking for."));
      } else if (!access && !isStudent) {
        router.push("/").then(() => toast.error("You are not enrolled in this course."));
      }
    }
  }, [router, course, courseLoading, isAuthenticated, access, isStudent, currentUser]);

  return (
    <AppLayout title={course?.title} maxWidth={false} loading={courseLoading}>
      {course && !courseLoading && isAuthenticated && (
        <Stack pt={{ xs: 3, md: 6 }} gap={4}>
          <Grid container>
            <Grid item xs={0.5} md={2.5} />
            <Grid item xs={11} md={7.3}>
              <CourseHeader course={course} access={access} />
            </Grid>
            <Grid item xs={0.5} md={2.2} />
          </Grid>
          {access && <CourseAdminView course={course} access={access} />}
          {isStudent && <CourseStudentView course={course} student={currentUser} />}
        </Stack>
      )}
    </AppLayout>
  )
}