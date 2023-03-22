import { Stack } from "@mui/material";
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

export interface CourseAdminViewProps {
  course: Course;
}

export function CourseAdminView({ course }: CourseAdminViewProps) {
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
        <CourseAdminViewNavigation />
      </Grid>
      <Grid xs>
        {router.query.view &&
          <>
            {router.query.view === "sections" && <SectionsView course={course} />}
            {router.query.view === "assignments" && <AssignmentsView course={course} />}
            {router.query.view === "people" && <PeopleView course={course} />}
            {router.query.view === "requests" && <RequestsView course={course} />}
          </>
        }
      </Grid>
      <Grid xs={2} />
    </Grid>
  );
}
