import { Box, Button, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useSections } from "@util/section/hooks";
import { Course } from "model/course";
import { FC, useState } from "react";
import CreateEditSectionDialog from "./CreateEditSectionDialog";
import SectionCard from "./SectionCard";

export interface SectionsProps {
  course: Course;
}

const Sections: FC<SectionsProps> = ({ course }) => {
  const [createSectionDialog, setcreateSectionDialog] = useState(false);

  const [maybeSections, _] = useSections();
  const sections = maybeSections ?? [];

  const getEnrollment = (sectionId: string) => {
    // loop through courses.students and count the number of students whose value is section id
    let count = 0;
    Object.keys(course.students).forEach((studentId) => {
      if (course.students[studentId] === sectionId) {
        count++;
      }
    });
    return count;
  }

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
          {sections.map((s) => <SectionCard section={s} enrollment={getEnrollment(s.ID)} />)}
        </Stack>
      </Box>
    </>
  );
}

export default Sections;