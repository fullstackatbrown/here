import { Grid, Typography, useTheme } from "@mui/material";
import { useAssignmentsMap } from "api/assignment/hooks";
import { useSectionsMap } from "api/section/hooks";
import { Course } from "model/course";
import { CoursePermission } from "model/user";
import { useRouter } from "next/router";
import { useEffect } from "react";
import AssignmentsView from "./AssignmentsView/AssignmentsView";
import CourseAdminViewNavigation from "./CourseAdminViewNavigation";
import PeopleView from "./PeopleView/PeopleView";
import RequestsView from "./RequestsView/RequestsView";
import SectionsView from "./SectionsView/SectionsView";
import SettingsView from "./SettingsView/SettingsView";
import { useCourseInvites } from "api/auth/hooks";

export interface CourseAdminViewProps {
  course: Course;
  access: CoursePermission;
}

export default function CourseAdminView({ course, access }: CourseAdminViewProps) {
  const router = useRouter();
  const { courseID } = router.query;
  const [sectionsMap, sectionsMapLoading] = useSectionsMap(course.ID);
  const [assignmentsMap, assignmentsMapLoading] = useAssignmentsMap(course.ID);
  const [invitedStudents, invitedStudentsLoading] = useCourseInvites(course.ID, CoursePermission.CourseStudent)

  useEffect(() => {
    // Always do navigations after the first render
    const view = router.query.view;
    if (view === undefined || !["sections", "assignments", "people", "requests", "settings"].includes(view as string)) {
      router.push(`${courseID}/?view=sections`, undefined, { shallow: true });
    }
  }, [router, courseID]);

  const loading = sectionsMapLoading || assignmentsMapLoading || invitedStudentsLoading;
  return (
    <Grid container>
      <Grid item xs={0.5} md={2.5} pt={1} pl={{ md: 10 }}>
        <CourseAdminViewNavigation access={access} />
      </Grid>
      <Grid item xs={11} md={7.3}>
        {router.query.view && !loading && (
          <>
            {router.query.view === "sections" && <SectionsView {...{ course, access, sectionsMap }} />}
            {router.query.view === "assignments" && (
              <AssignmentsView {...{ course, access, sectionsMap, assignmentsMap }} />
            )}
            {router.query.view === "people" && <PeopleView {...{ course, access, sectionsMap, assignmentsMap, invitedStudents }} />}
            {router.query.view === "requests" && <RequestsView {...{ course, access, sectionsMap, assignmentsMap }} />}
            {router.query.view === "settings" &&
              (access === CoursePermission.CourseAdmin ? (
                <SettingsView course={course} />
              ) : (
                <Typography>Oops.. You have no permission to access this page</Typography>
              ))}
          </>)}
      </Grid>
      <Grid item xs={0.5} md={2.2} />
    </Grid>
  );
}
