import { Box, Typography } from "@mui/material";
import { Course } from "model/general";

export interface GradeOptionsProps {
  course: Course;
}

export default function GradeOptions(props: GradeOptionsProps) {
  return (
    <>
      <Typography variant="h6" fontWeight={600}>
        Grade Options
      </Typography>
      <Box height={100}>Fill this in...</Box>
    </>
  );
}
