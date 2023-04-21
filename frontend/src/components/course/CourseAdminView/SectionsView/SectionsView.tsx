import { Button, Stack, Typography } from "@mui/material";
import { Course, CourseStatus } from "model/course";
import { Section } from "model/section";
import { CoursePermission } from "model/user";
import { FC, useState } from "react";
import ViewHeader from "../ViewHeader/ViewHeader";
import AvailabilitySurvey from "./AvailabilitySurvey/AvailabilitySurvey";
import CreateEditSectionDialog from "./Sections/CreateEditSectionDialog";
import SectionCard from "./Sections/SectionCard";

export interface SectionsViewProps {
  course: Course;
  access: CoursePermission;
  sectionsMap: Record<string, Section>;
}

const SectionsView: FC<SectionsViewProps> = ({
  course,
  access,
  sectionsMap,
}) => {
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
  };

  return (
    <>
      <CreateEditSectionDialog
        open={createSectionDialog}
        onClose={() => setcreateSectionDialog(false)}
        courseID={course.ID}
      />
      <Stack direction="row" justifyContent="space-between" mb={1} height={40}>
        <ViewHeader view="sections" views={["sections", "assignments", "people", "requests", "settings"]} access={access} />
        {/* Only course admin can add sections */}
        {access === CoursePermission.CourseAdmin && (
          <Button disabled={course.status === CourseStatus.CourseArchived} onClick={() => setcreateSectionDialog(true)}>+ New</Button>
        )}
      </Stack>
      {sections?.length == 0 && (
        <Typography textAlign="center" mt={3}>
          {access === CoursePermission.CourseAdmin
            ? "Add the first section here"
            : "No section has been added yet."}
        </Typography>
      )}
      <Stack direction="column" spacing={2} mb={5}>
        {sections?.map((s) => (
          <SectionCard
            key={s.ID}
            archived={course.status === CourseStatus.CourseArchived}
            section={s}
            enrollment={getEnrollment(s.ID)}
          />
        ))}
      </Stack>
      {access === CoursePermission.CourseAdmin &&
        sections &&
        sections.length > 0 && <AvailabilitySurvey {...{ course, sections }} />}
    </>
  );
};

export default SectionsView;
