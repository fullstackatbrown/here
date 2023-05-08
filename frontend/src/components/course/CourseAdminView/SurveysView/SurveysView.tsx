import { Button, Stack, Typography } from "@mui/material";
import { Course, CourseStatus } from "model/course";
import { Section } from "model/section";
import { Survey } from "model/survey";
import { CoursePermission } from "model/user";
import { FC, useMemo, useState } from "react";
import AdminViewHeader from "../AdminViewHeader";
import CreateEditSurveyDialog from "./CreateEditSurveyDialog/CreateEditSurveyDialog";
import SurveyCard from "./SurveyCard";

export interface SurveysViewProps {
  course: Course;
  access: CoursePermission;
  surveys: Survey[];
  sectionsMap: Record<string, Section>
}

const SurveysView: FC<SurveysViewProps> = ({
  course,
  access,
  surveys,
  sectionsMap,
}) => {

  const [createSurveyDialog, setCreateSurveyDialog] = useState(false);
  const isCourseActive = course.status === CourseStatus.CourseActive;

  const numStudents = () => {
    if (!course.students) return 0;
    return Object.keys(course.students).length;
  }

  const surveysSorted = useMemo(() => {
    return surveys.sort((a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime())
  }, [surveys])

  return (
    <>
      <CreateEditSurveyDialog
        open={createSurveyDialog}
        onClose={() => setCreateSurveyDialog(false)}
        courseID={course.ID}
        sections={Object.values(sectionsMap)}
      />
      <AdminViewHeader
        view="surveys"
        access={access}
        endElement={
          access === CoursePermission.CourseAdmin && (
            <Button disabled={!isCourseActive} onClick={() => setCreateSurveyDialog(true)}>
              + New
            </Button>
          )}
      />
      {surveysSorted?.length == 0 && (
        <Typography textAlign="center" mt={3}>
          {access === CoursePermission.CourseAdmin
            ? "Create the first survey here"
            : "No survey has been created for the course."}
        </Typography>
      )}
      <Stack direction="column" spacing={2} mb={5}>
        {surveysSorted?.map((survey) => (
          <SurveyCard
            key={survey.ID}
            survey={survey}
            numStudents={numStudents()}
            sectionsMap={sectionsMap}
            active={isCourseActive}
            admin={access === CoursePermission.CourseAdmin}
          />
        ))}
      </Stack >
    </>
  );
};

export default SurveysView;
