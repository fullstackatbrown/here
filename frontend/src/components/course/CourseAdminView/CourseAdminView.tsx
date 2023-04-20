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

export interface CourseAdminViewProps {
  course: Course;
  access: CoursePermission;
  headerInView: boolean;
}

export default function CourseAdminView({ course, access, headerInView }: CourseAdminViewProps) {
  const router = useRouter();
  const { courseID } = router.query;
  const [sectionsMap, sectionsMapLoading] = useSectionsMap(course.ID);
  const [assignmentsMap, assignmentsMapLoading] = useAssignmentsMap(course.ID);
  const theme = useTheme();

  useEffect(() => {
    // Always do navigations after the first render
    if (router.query.view === undefined) {
      router.push(`${courseID}/?view=sections`, undefined, { shallow: true });
    }
  }, [router, courseID]);

  return (
    <Grid container>
      <Grid item xs={0.5} md={2.5} pt={1} sx={{
        [theme.breakpoints.up('md')]: {
          paddingLeft: 10,
        },
      }}>
        <CourseAdminViewNavigation access={access} headerInView={headerInView} />
      </Grid>
      <Grid xs={11} md={7.3}>
        {router.query.view && sectionsMap && assignmentsMap && (
          <>
            {router.query.view === "sections" && <SectionsView {...{ course, access, sectionsMap }} />}
            {router.query.view === "assignments" && (
              <AssignmentsView {...{ course, access, sectionsMap, assignmentsMap }} />
            )}
            {router.query.view === "people" && <PeopleView {...{ course, access, sectionsMap, assignmentsMap }} />}
            {router.query.view === "requests" && <RequestsView {...{ course, access, sectionsMap, assignmentsMap }} />}
            {router.query.view === "settings" &&
              (access === CoursePermission.CourseAdmin ? (
                <SettingsView course={course} />
              ) : (
                <Typography>Oops.. You have no permission to access this page</Typography>
              ))}
          </>)}
      </Grid>
      <Grid xs={0.5} md={2.2} />
    </Grid>
  );
}
