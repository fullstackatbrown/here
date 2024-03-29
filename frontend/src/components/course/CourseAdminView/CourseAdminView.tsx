import { Grid, Typography } from "@mui/material";
import { useAssignmentsMap } from "api/assignment/hooks";
import { useCourseInvites } from "api/auth/hooks";
import { useSectionsMap } from "api/section/hooks";
import { usePendingSwaps } from "api/swaps/hooks";
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
import { AdminViews, View } from "model/general";
import { useSurveys } from "api/surveys/hooks";
import SurveysView from "./SurveysView/SurveysView";

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
  const [pendingRequests, pendingRequestsLoading] = usePendingSwaps(course.ID);
  const [surveys, surveysLoading] = useSurveys(course.ID);

  useEffect(() => {
    // Always do navigations after the first render
    const view = router.query.view;
    if (view === undefined || !AdminViews.includes(view as View)) {
      router.push(`${courseID}/?view=sections`, undefined, { shallow: true });
    }
  }, [router, courseID]);

  return (
    <Grid container>
      <Grid item xs={0.5} md={2.5} pt={1} pl={{ md: 10 }}>
        <CourseAdminViewNavigation {...{ access, pendingRequests }} />
      </Grid>
      <Grid item xs={11} md={7.3}>
        {router.query.view && !sectionsMapLoading && (
          <>
            {router.query.view === "sections" && <SectionsView {...{ course, access, sectionsMap }} />}
            {router.query.view === "assignments" && !assignmentsMapLoading &&
              <AssignmentsView {...{ course, access, sectionsMap, assignmentsMap }} />
            }
            {router.query.view === "surveys" && !surveysLoading && <SurveysView {...{ course, access, surveys, sectionsMap }} />}
            {router.query.view === "people" && !invitedStudentsLoading && !assignmentsMapLoading && <PeopleView {...{ course, access, sectionsMap, assignmentsMap, invitedStudents }} />}
            {router.query.view === "requests" && !assignmentsMapLoading && !pendingRequestsLoading && <RequestsView {...{ course, access, sectionsMap, assignmentsMap, pendingRequests }} />}
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
