import { Stack, Typography } from "@mui/material";
import { Course } from "model/course";
import PeopleTable from "./PeopleTable";

export interface PeopleViewProps {
  course: Course;
}

export default function PeopleView({ course }: PeopleViewProps) {
  return (
    <>
      <Stack direction="row" justifyContent="space-between" mb={1}>
        <Typography variant="h6" fontWeight={600}>
          People
        </Typography>
      </Stack>
      <PeopleTable students={course.students} />
    </>
  );
}
