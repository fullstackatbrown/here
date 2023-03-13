import { Box, Button, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useSections } from "@util/section/hooks";
import { Course } from "model/course";
import { useState } from "react";
import CreateEditSectionDialog from "./CreateEditSectionDialog";
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
      <CreateEditSectionDialog open={createSectionDialog} onClose={() => setcreateSectionDialog(false)}
      />
      <Stack direction="row" justifyContent="space-between" mb={1}>
        <Typography variant="h6" fontWeight={600}>
          Sections
        </Typography>
        <Button onClick={() => setcreateSectionDialog(true)}>
          + New
        </Button>
      </Stack>
      <Box height={300}>
        <Stack direction="column" spacing={2}>
          {sections.map((s) => <SectionCard section={s} />)}
        </Stack>
      </Box>
    </>
  );
}
