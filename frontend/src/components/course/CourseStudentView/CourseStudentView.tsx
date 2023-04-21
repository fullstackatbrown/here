import {
  Grid
} from "@mui/material";
import { useAssignmentsMap } from "api/assignment/hooks";
import { useSectionsMap } from "api/section/hooks";
import { useSurvey } from "api/surveys/hooks";
import { useSwapsByStudent } from "api/swaps/hooks";
import { Course } from "model/course";
import { User } from "model/user";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SurveyDialog from "../CourseAdminView/SectionsView/AvailabilitySurvey/SurveyDialog";
import CourseStudentViewNavigation from "./CourseStudentViewNavigation";
import StudentRequestsView from "./Requests/StudentRequestsView";
import StudentHomeView from "./Home/StudentHomeView";
import StudentSettingsView from "./Settings/StudentSettingsView";

export interface CourseStudentViewProps {
  course: Course;
  student: User;
}

function CourseStudentView({ course, student }: CourseStudentViewProps) {
  const router = useRouter();
  const [sectionsMap, sectionsMapLoading] = useSectionsMap(course.ID)
  const [assignmentsMap, assignmentsMapLoading] = useAssignmentsMap(course.ID)
  const [requests, requestsLoading] = useSwapsByStudent(course.ID, student.ID);
  const [survey, surveyLoading] = useSurvey(course.ID);

  useEffect(() => {
    const view = router.query.view;
    if (view === undefined || !["home", "my requests", "settings"].includes(view as string)) {
      router.push(`${course.ID}/?view=home`, undefined, { shallow: true });
    }
  }, [router, course]);

  return (
    !sectionsMapLoading && !assignmentsMapLoading && !surveyLoading &&
    <Grid container>
      <Grid item xs={0.5} md={2.5} pt={1} pl={{ md: 10 }}>
        <CourseStudentViewNavigation />
      </Grid>
      <Grid item xs={11} md={7.3}>
        {router.query.view && sectionsMap && assignmentsMap && (
          <>
            {router.query.view === "home" && !surveyLoading && <StudentHomeView {...{ course, student, survey, sectionsMap, assignmentsMap }} />}
            {router.query.view === "my requests" && !requestsLoading && <StudentRequestsView {...{ course, student, requests, sectionsMap, assignmentsMap }} />}
            {router.query.view === "settings" && <StudentSettingsView course={course} />}
          </>)}
      </Grid>
      <Grid item xs={0.5} md={2.2} />
    </Grid>
  );
}

export default CourseStudentView