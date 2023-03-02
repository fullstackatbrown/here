import { Stack } from "@mui/material";
import { Course } from "model/general";
import { useState } from "react";
import CourseHeader from "../CourseHeader";
import CourseAdminViewNavigation from "./CourseAdminViewNavigation";
import SectionsView from "./SectionsView/SectionsView";
import Grid from "@mui/material/Unstable_Grid2";
import RequestsView from "./RequestsView/RequestsView";
import CheckoffView from "./CheckoffView/CheckoffView";

export interface CourseAdminViewProps {
  course: Course;
}

export function CourseAdminView(props: CourseAdminViewProps) {
  const [view, setView] = useState<"sections" | "checkoff" | "requests">(
    "sections"
  );

  return (
    <Stack paddingTop={12} gap={4}>
      <Grid container spacing={2}>
        <Grid xs={2} />
        <Grid xs={10}>
          <CourseHeader course={props.course} />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid xs={2}>
          <CourseAdminViewNavigation setView={setView}/>
        </Grid>
        <Grid xs>
          {view === "sections" && <SectionsView course={props.course} />}
          {view === "checkoff" && <CheckoffView />}
          {view === "requests" && <RequestsView />}
        </Grid>
        <Grid xs={2} />
      </Grid>
    </Stack>
  );
}
