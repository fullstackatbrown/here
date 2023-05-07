import { Button, Stack, Typography } from "@mui/material";
import { Course, CourseStatus } from "model/course";
import { Section } from "model/section";
import { CoursePermission } from "model/user";
import { FC, useState } from "react";
import AdminViewHeader from "../AdminViewHeader";
import CreateEditSectionDialog from "./Sections/CreateEditSectionDialog";
import SectionCard from "./Sections/SectionCard";
import { useSurvey } from "api/surveys/hooks";
import SurveySection from "./Survey/Survey";

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
  const [survey, surveyLoading] = useSurvey(course.ID || undefined);
  const [createSectionDialog, setcreateSectionDialog] = useState(false);

  return (
    <>
      <CreateEditSectionDialog
        open={createSectionDialog}
        onClose={() => setcreateSectionDialog(false)}
        courseID={course.ID}
      />
      <AdminViewHeader
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
        {sections?.map((s) => (
          <SectionCard
            key={s.ID}
            active={course.status === CourseStatus.CourseActive}
            section={s}
          />
        ))}
      </Stack>
      {access === CoursePermission.CourseAdmin &&
        !surveyLoading && <SurveySection {...{ course, sections, survey }} />}
    </>
  );
};

export default SectionsView;
