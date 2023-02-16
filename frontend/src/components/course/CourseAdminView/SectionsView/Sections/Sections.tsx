import { Box, Button, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { Course } from "model/general";

export interface SectionsProps {
  course: Course;
}

export default function Sections(props: SectionsProps) {
  return (
    <>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h6" fontWeight={600}>
          Sections
        </Typography>
        <Button>
          + New
        </Button>
      </Stack>
      <Box height={300}>Fill this in...</Box>
    </>
  );
}
