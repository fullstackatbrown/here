import { Box, Button, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useSections } from "@util/section/hooks";
import { Course } from "model/general";
import { useState } from "react";
import CreateSectionDialog from "./CreateSectionDialog";
import SectionCard from "./SectionCard";

export interface SectionsProps {
  course: Course;
}

export default function Sections(props: SectionsProps) {
  const [createSectionDialog, setcreateSectionDialog] = useState(false);

  const [maybeSections, _] = useSections();
  const sections = maybeSections ?? [];
  return (
    <>
      <CreateSectionDialog open={createSectionDialog} onClose={() => setcreateSectionDialog(false)}
      />
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h6" fontWeight={600}>
          Sections
        </Typography>
        <Button onClick={() => setcreateSectionDialog(true)}>
          + New
        </Button>
      </Stack>
      <Box height={300}>
        <SectionCard section={sections[0]} />
      </Box>
    </>
  );
}
