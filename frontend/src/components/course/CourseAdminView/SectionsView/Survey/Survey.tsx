import { Box, Button, Stack, Tooltip, Typography } from "@mui/material";
import { Course, CourseStatus } from "model/course";
import { Section } from "model/section";
import { Survey } from "model/survey";
import { useState } from "react";
import CreateSurveyDialog from "./CreateEditSurveyDialog/CreateEditSurveyDialog";
import SurveyCard from "./SurveyCard";
import SurveyDialog from "./SurveyDialog";

export interface SurveyProps {
  course: Course;
  sections: Section[];
  surveys: Survey[];
}

export default function SurveySection({ course, sections, surveys }: SurveyProps) {
  const [createSurveyDialog, setCreateSurveyDialog] = useState(false);
  const [surveyPreviewDialog, setSurveyPreviewDialog] = useState(false);
  const isCourseActive = course.status === CourseStatus.CourseActive;

  const numStudents = () => {
    if (!course.students) return 0;
    return Object.keys(course.students).length;
  }

  return (
    <>
      <CreateSurveyDialog
        open={createSurveyDialog}
        onClose={() => setCreateSurveyDialog(false)}
        courseID={course.ID}
        sections={sections}
      />
      <Stack direction="row" justifyContent="space-between" mb={1}>
        <Typography variant="h6" fontWeight={600}>
          Survey
        </Typography>
        <Button disabled={!isCourseActive} onClick={() => setCreateSurveyDialog(true)}>
          + Create Survey
        </Button>
      </Stack>
      {/* TODO: sorting between the surveys */}
      <Box height={100}>
        <Stack direction="column" spacing={2} mb={5}>
          {surveys?.map((survey) =>
            <SurveyCard survey={survey} numStudents={numStudents()} sections={sections} active={isCourseActive} />
          )}
        </Stack >
      </Box>
    </>
  );
}
