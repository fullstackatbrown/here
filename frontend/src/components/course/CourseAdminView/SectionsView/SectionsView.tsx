import ViewHeader from "@components/shared/ViewHeader/ViewHeader";
import { Button, Stack, Typography } from "@mui/material";
import { sortSections } from "@util/shared/sortSectionTime";
import { Course, CourseStatus } from "model/course";
import { Section } from "model/section";
import { CoursePermission } from "model/user";
import { FC, useState } from "react";
import CreateEditSectionDialog from "./CreateEditSectionDialog";
import SectionCard from "./SectionCard";

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

  return (
    <>
      <CreateEditSectionDialog
        open={createSectionDialog}
        onClose={() => setcreateSectionDialog(false)}
        courseID={course.ID}
      />
      <ViewHeader
        course={course}
        view="sections"
        access={access}
        endElement={
          access === CoursePermission.CourseAdmin && (
            <Button
              disabled={course.status === CourseStatus.CourseArchived}
              onClick={() => setcreateSectionDialog(true)}>
              + New
            </Button>
          )}
      />
      {sections?.length == 0 && (
        <Typography textAlign="center" mt={3}>
          {access === CoursePermission.CourseAdmin
            ? "Add the first section here"
            : "No section has been added yet."}
        </Typography>
      )}
      <Stack direction="column" spacing={2} mb={5}>
        {sortSections(sections)?.map((s) => (
          <SectionCard
            key={s.ID}
            active={course.status === CourseStatus.CourseActive}
            admin={access === CoursePermission.CourseAdmin}
            section={s}
          />
        ))}
      </Stack>
    </>
  );
};

export default SectionsView;
