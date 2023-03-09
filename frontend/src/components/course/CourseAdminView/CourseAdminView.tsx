import { Stack } from "@mui/material";
import { Views } from "model/general";
import { useState } from "react";
import CourseHeader from "../CourseHeader";
import CourseAdminViewNavigation from "./CourseAdminViewNavigation";
import SectionsView from "./SectionsView/SectionsView";
import Grid from "@mui/material/Unstable_Grid2";
import RequestsView from "./RequestsView/RequestsView";
import { Course } from "model/course";
import AssignmentsView from "./AssignmentsView/AssignmentsView";
import PeopleView from "./PeopleView/PeopleView";

export interface CourseAdminViewProps {
  course: Course;
}

export function CourseAdminView(props: CourseAdminViewProps) {
  const [view, setView] = useState<Views>("sections");

  return (
    <Stack paddingTop={12} gap={4}>
      <Grid container spacing={2}>
        <Grid xs={2}></Grid>
        <Grid xs={10}>
          <CourseHeader course={props.course} />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid xs={2}>
          <CourseAdminViewNavigation setView={setView} />
        </Grid>
        <Grid xs>
          {view === "sections" && <SectionsView course={props.course} />}
          {view === "assignments" && <AssignmentsView />}
          {view === "people" && <PeopleView />}
          {view === "requests" && <RequestsView />}
        </Grid>
        <Grid xs={2} />
      </Grid>
    </Stack>
  );
}
