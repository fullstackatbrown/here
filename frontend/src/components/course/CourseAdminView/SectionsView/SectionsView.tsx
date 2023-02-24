import { Stack } from "@mui/material";
import { Course } from "model/general";
import Assignments from "./Assignments/Assignments";
import AvailabilitySurvey from "./AvailabilitySurvey/AvailabilitySurvey";
import GradeOptions from "./GradeOptions/GradeOptions";
import Sections from "./Sections/Sections";

export interface SectionsViewProps {
  course: Course;
}

export default function SectionsView(props: SectionsViewProps) {
  return (
    <Stack>
      <Sections course={props.course} />
      <AvailabilitySurvey course={props.course} />
      <GradeOptions course={props.course} />
      <Assignments course={props.course} />
    </Stack>
  );
}
