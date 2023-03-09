import { Stack } from "@mui/material";
import { Course } from "model/course";

export interface RequestsViewProps {
  course: Course;
}

export default function RequestsView({ course }: RequestsViewProps) {
  return (
    <Stack>
      <div>Requests View</div>
    </Stack>
  );
}