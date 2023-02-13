import { Box, Typography } from "@mui/material";
import { Course } from "model/general";

export interface SectionsProps {
  course: Course;
}

export default function Sections(props: SectionsProps) {
  return (
    <>
      <Typography variant="h6" fontWeight={600}>
        Sections
      </Typography>
      <Box height={300}>Fill this in...</Box>
    </>
  );
}
