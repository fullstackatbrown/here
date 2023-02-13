import { Box, Typography } from "@mui/material";
import { Course } from "model/general";

export interface AssignmentsProps {
  course: Course;
}

export default function Assignments(props: AssignmentsProps) {
  return (
    <>
      <Typography variant="h6" fontWeight={600}>
        Assignments
      </Typography>
      <Box height={300}>Fill this in...</Box>
    </>
  );
}
