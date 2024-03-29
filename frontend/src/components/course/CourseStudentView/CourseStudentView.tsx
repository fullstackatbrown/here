import {
  Grid
} from "@mui/material";
import { useAssignmentsMap } from "api/assignment/hooks";
import { useSectionsMap } from "api/section/hooks";
import { useSurveys } from "api/surveys/hooks";
import { useSwapsByStudent } from "api/swaps/hooks";
import { Course } from "model/course";
import { CoursePermission, User } from "model/user";
import { useRouter } from "next/router";
import { useEffect } from "react";
import CourseStudentViewNavigation from "./CourseStudentViewNavigation";
import StudentHomeView from "./Home/StudentHomeView";
import StudentRequestsView from "./Requests/StudentRequestsView";
import StudentSettingsView from "./Settings/StudentSettingsView";
import SurveysView from "./Surveys/StudentSurveysView";
import { StudentViews, View } from "model/general";
import PeopleView from "../CourseAdminView/PeopleView/PeopleView";

export interface CourseStudentViewProps {
  course: Course;
  student: User;
}

function CourseStudentView({ course, student }: CourseStudentViewProps) {
  const router = useRouter();
  const [sectionsMap, sectionsMapLoading] = useSectionsMap(course.ID)
  const [assignmentsMap, assignmentsMapLoading] = useAssignmentsMap(course.ID)
  const [requests, requestsLoading] = useSwapsByStudent(course.ID, student.ID);
  const [surveys, surveysLoading] = useSurveys(course.ID);

  useEffect(() => {
    const view = router.query.view;
    if (view === undefined || !StudentViews.includes(view as View)) {
      router.push(`${course.ID}/?view=home`, undefined, { shallow: true });
    }
  }, [router, course]);

  return (
    <Grid container>
      <Grid item xs={0.5} md={2.5} pt={1} pl={{ md: 10 }}>
        <CourseStudentViewNavigation {...{ student, surveys, course }} />
      </Grid>
      <Grid item xs={11} md={7.3}>
        {router.query.view && !sectionsMapLoading && !assignmentsMapLoading && (
          <>
            {router.query.view === "home" && !surveysLoading && <StudentHomeView {...{ course, student, surveys, sectionsMap, assignmentsMap }} />}
            {router.query.view === "my requests" && !requestsLoading && <StudentRequestsView {...{ course, student, requests, sectionsMap, assignmentsMap }} />}
            {router.query.view === "surveys" && !surveysLoading && <SurveysView {...{ course, student, surveys }} />}
            {router.query.view === "people" && course.config.sharePeopleListWithStudents && <PeopleView {...{ course, student, sectionsMap, assignmentsMap }} access={CoursePermission.CourseStudent} />}
            {router.query.view === "settings" && <StudentSettingsView course={course} />}
          </>)}
      </Grid>
      <Grid item xs={0.5} md={2.2} />
    </Grid>
  );
}

export default CourseStudentView