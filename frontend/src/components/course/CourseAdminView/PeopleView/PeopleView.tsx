import { Stack } from "@mui/material";
import { Course } from "model/course";

export interface PeopleViewProps {
  course: Course;
}

export default function PeopleView({ course }: PeopleViewProps) {
  return (
    <Stack>
      <div>People View</div>
    </Stack>
  );
}
