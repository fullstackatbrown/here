import { Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
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
}

export default function CourseAdminView({ course, access }: CourseAdminViewProps) {
  const router = useRouter();
  const { courseID } = router.query;
  const [sectionsMap, sectionsMapLoading] = useSectionsMap(course.ID);
  const [assignmentsMap, assignmentsMapLoading] = useAssignmentsMap(course.ID);

  useEffect(() => {
    // Always do navigations after the first render
    if (router.query.view === undefined) {
      router.push(`${courseID}/?view=sections`, undefined, { shallow: true })
    }
  }, [])

  return (
    <Grid container>
      <Grid xs={2}>
        <CourseAdminViewNavigation access={access} />
      </Grid>
      <Grid xs>
        {router.query.view && sectionsMap && assignmentsMap &&
          <>
            {router.query.view === "sections" && <SectionsView {...{ course, access, sectionsMap }} />}
            {router.query.view === "assignments" && <AssignmentsView {...{ course, access, sectionsMap, assignmentsMap }} />}
            {router.query.view === "people" && <PeopleView {...{ course, access, sectionsMap, assignmentsMap }} />}
            {router.query.view === "requests" && <RequestsView {...{ course, sectionsMap, assignmentsMap }} />}
            {router.query.view === "settings" &&
              (access === CoursePermission.CourseAdmin ?
                <SettingsView course={course} /> :
                <Typography>
                  Oops.. You have no permission to access this page
                </Typography>)}
          </>
        }
      </Grid>
      <Grid xs={router.query.view === "requests" ? 0.5 : 2} />
    </Grid >
  );
}
