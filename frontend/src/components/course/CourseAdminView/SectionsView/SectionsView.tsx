import { Stack } from "@mui/material";
import { Course } from "model/general";
import Assignments from "./Assignments/Assignments";
import GradeOptions from "./GradeOptions/GradeOptions";
import Sections from "./Sections/Sections";

export interface SectionsViewProps {
  course: Course;
}

export default function SectionsView(props: SectionsViewProps) {
  return (
    <Stack>
      <Sections course={props.course} />
      <Assignments course={props.course} />
      <GradeOptions course={props.course} />
    </Stack>
  );
}
