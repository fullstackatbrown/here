import { Box, Stack, Typography } from "@mui/material";
import { View } from "model/general";
import { useEffect, useState } from "react";
import CourseHeader from "../CourseHeader";
import CourseAdminViewNavigation from "./CourseAdminViewNavigation";
import SectionsView from "./SectionsView/SectionsView";
import Grid from "@mui/material/Unstable_Grid2";
import RequestsView from "./RequestsView/RequestsView";
import { Course } from "model/course";
import AssignmentsView from "./AssignmentsView/AssignmentsView";
import PeopleView from "./PeopleView/PeopleView";
import { useRouter } from "next/router";
import SettingsView from "./SettingsView/SettingsView";
import { CoursePermission } from "model/user";
import { Assignment } from "model/assignment";
import { Section } from "model/section";

export interface CourseAdminViewProps {
  course: Course;
  access: CoursePermission;
  assignmentsMap: Record<string, Assignment>;
  sectionsMap: Record<string, Section>;
}

export default function CourseAdminView({ course, access, sectionsMap, assignmentsMap }: CourseAdminViewProps) {
  const router = useRouter();
  const { courseID } = router.query;

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
        {router.query.view &&
          <>
            {router.query.view === "sections" && <SectionsView {...{ course, access, sectionsMap }} />}
            {router.query.view === "assignments" && <AssignmentsView {...{ course, access, assignmentsMap, sectionsMap }} />}
            {router.query.view === "people" && <PeopleView {...{ course, access, assignmentsMap, sectionsMap }} />}
            {router.query.view === "requests" && <RequestsView {...{ course, access, assignmentsMap, sectionsMap }} />}
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
    </Grid>
  );
}
