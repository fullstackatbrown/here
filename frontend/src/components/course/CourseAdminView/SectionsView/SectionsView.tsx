import { Stack } from "@mui/material";
import { Course } from "model/general";
import AllSections from "./AllSections/AllSections";
import GradeOptions from "./GradeOptions/GradeOptions";
import SectionAssignments from "./SectionAssignments/SectionAssignments";

export interface SectionsViewProps {
  course: Course;
}

export default function SectionsView(props: SectionsViewProps) {
  return (
    <Stack>
      <SectionAssignments course={props.course} />
      <AllSections course={props.course} />
      <GradeOptions course={props.course}/>
    </Stack>
  );
}
