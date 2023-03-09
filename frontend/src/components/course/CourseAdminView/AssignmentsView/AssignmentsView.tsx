import { Stack } from "@mui/material";
import { Course } from "model/course";
import Assignments from "./Assignments/Assignments";

export interface SectionsViewProps {
  course: Course;
}

export default function AssignmentsView({ course }: SectionsViewProps) {
  return (
    <Stack>
      <Assignments course={course} />
    </Stack>
  );
}
