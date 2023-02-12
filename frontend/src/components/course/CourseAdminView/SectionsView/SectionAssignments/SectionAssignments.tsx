import { Box, Typography } from "@mui/material";
import { Course } from "model/general";

export interface SectionAssignmentsProps {
  course: Course;
}

export default function SectionAssignments(props: SectionAssignmentsProps) {
  return (
    <>
      <Typography variant="h6" fontWeight={600}>
        Section Assignments
      </Typography>
      <Box height={300}>Fill this in...</Box>
    </>
  );
}
