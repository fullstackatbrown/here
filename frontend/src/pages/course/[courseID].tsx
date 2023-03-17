import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import AppLayout from "@components/shared/AppLayout";
import CourseAdminView from "@components/course/CourseAdminView";
import { useCourse } from "@util/course/hooks";
import { CourseStudentView } from "@components/course/CourseStudentView/CourseStudentView";

export default function CoursePage() {
  const router = useRouter();
  const { courseID } = router.query;
  const [course, courseLoading] = useCourse(courseID as string);

  // Redirect user back to home page if no queue with given ID is found
  useEffect(() => {
    if (router.isReady && !courseLoading && !course) {
      router
        .push("/")
        .then(() =>
          toast.error("We couldn't find the queue you were looking for.")
        );
    }
  }, [router, course, courseLoading]);

  return (
    <AppLayout title={course?.title} maxWidth="lg" loading={courseLoading}>
      {/* {course && !courseLoading && <CourseAdminView course={course} />} */}
      {course && !courseLoading && <CourseStudentView course={course} />}
    </AppLayout>
  );
}
