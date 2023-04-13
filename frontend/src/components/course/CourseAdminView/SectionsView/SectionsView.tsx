import { Button, Stack, Typography } from "@mui/material";
import { Course } from "model/course";
import { Section } from "model/section";
import { CoursePermission } from "model/user";
import { FC, useState } from "react";
import AvailabilitySurvey from "./AvailabilitySurvey/AvailabilitySurvey";
import CreateEditSectionDialog from "./Sections/CreateEditSectionDialog";
import SectionCard from "./Sections/SectionCard";

export interface SectionsViewProps {
  course: Course;
  access: CoursePermission;
  sectionsMap: Record<string, Section>;
}

const SectionsView: FC<SectionsViewProps> = ({ course, access, sectionsMap }) => {
  const sections = Object.values(sectionsMap);
  const [createSectionDialog, setcreateSectionDialog] = useState(false);

  const getEnrollment = (sectionId: string) => {
    // loop through courses.students and count the number of students whose value is section id
    if (!course.students) return 0;
    let count = 0;
    Object.keys(course.students).forEach((studentId) => {
      if (course.students[studentId].defaultSection === sectionId) {
        count++;
      }
    });
    return count;
  }

  return (
    <>
      <CreateEditSectionDialog open={createSectionDialog} onClose={() => setcreateSectionDialog(false)} courseID={course.ID}
      />
      <Stack direction="row" justifyContent="space-between" mb={1}>
        <Typography variant="h6" fontWeight={600}>
          Sections
        </Typography>
        {access === CoursePermission.CourseAdmin &&
          <Button onClick={() => setcreateSectionDialog(true)}>
            + New
          </Button>
        }
      </Stack>
      {sections && sections.length == 0 &&
        <Typography textAlign="center" mt={3}>
          {access === CoursePermission.CourseAdmin ?
            "Add the first section here" :
            "No section has been added yet."
          }
        </Typography>
      }
      <Stack direction="column" spacing={2} mb={5}>
        {sections && sections.map((s) =>
          <SectionCard key={s.ID} section={s} enrollment={getEnrollment(s.ID)} />)
        }
      </Stack>
      {sections && sections.length > 0 && <AvailabilitySurvey {...{ course, sections }} />}
    </>
  );
}

export default SectionsView;