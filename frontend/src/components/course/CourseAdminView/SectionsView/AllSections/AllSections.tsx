import { Box, Typography } from "@mui/material";
import { Course } from "model/general";

export interface AllSectionsProps {
  course: Course;
}

export default function AllSections(props: AllSectionsProps) {
  return (
    <>
      <Typography variant="h6" fontWeight={600}>
        All Sections
      </Typography>
      <Box height={300}>Fill this in...</Box>
    </>
  );
}
