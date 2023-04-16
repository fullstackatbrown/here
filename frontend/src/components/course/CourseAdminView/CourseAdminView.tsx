import { Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { Course } from "model/course";
import { CoursePermission } from "model/user";
import { useRouter } from "next/router";
import { useEffect } from "react";
import AssignmentsView from "./AssignmentsView/AssignmentsView";
import CourseAdminViewNavigation from "./Navigation/CourseAdminViewNavigation";
import PeopleView from "./PeopleView/PeopleView";
import RequestsView from "./RequestsView/RequestsView";
import SectionsView from "./SectionsView/SectionsView";
import SettingsView from "./SettingsView/SettingsView";
import { useSections, useSectionsMap } from "api/section/hooks";
import { useAssignmentsMap } from "api/assignment/hooks";
import DesktopNavigation from "./Navigation/Desktop/DesktopNavigation";

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

  useEffect(() => {
    // Always do navigations after the first render
    if (router.query.view === undefined) {
      router.push(`${courseID}/?view=sections`, undefined, { shallow: true });
    }
  }, [router, courseID]);

  return (
    // <Grid container style={{ height: "100vh" }}>
    //   <Grid
    //     xs={0.5}
    //     sm={2}
    //     md={2}
    //     mt={11}
    //     display="flex"
    //   // alignItems="center"
    //   >
    //     <DesktopNavigation access={access} headerInView={headerInView} courseCode={course.code} />
    //   </Grid>
    //   <Grid xs>

    router.query.view && sectionsMap && assignmentsMap && (
      <>
        {router.query.view === "sections" && <SectionsView {...{ course, access, sectionsMap }} />}
        {router.query.view === "assignments" && (
          <AssignmentsView {...{ course, access, sectionsMap, assignmentsMap }} />
        )}
        {router.query.view === "people" && <PeopleView {...{ course, access, sectionsMap, assignmentsMap }} />}
        {router.query.view === "requests" && <RequestsView {...{ course, sectionsMap, assignmentsMap }} />}
        {router.query.view === "settings" &&
          (access === CoursePermission.CourseAdmin ? (
            <SettingsView course={course} />
          ) : (
            <Typography>Oops.. You have no permission to access this page</Typography>
          ))}
      </>
    )

    //   </Grid>
    //   <Grid
    //     xs={0.5}
    //     sm={router.query.view === "requests" ? 0.5 : 2}
    //     md={router.query.view === "requests" ? 0.5 : 2}
    //   />
    // </Grid>
  );
}
