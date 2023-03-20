import { Box, Button, Card, Paper, Stack, Typography } from "@mui/material";
import { useSurvey } from "@util/surveys/hooks";
import { Course } from "model/course";
import { Section } from "model/section";
import { Survey } from "model/survey";
import { useEffect, useState } from "react";
import CreateSurveyDialog from "./CreateEditSurveyDialog";
import SurveyCard from "./SurveyCard";
import SurveyDialog from "./SurveyDialog";

export interface AvailabilitySurveyProps {
  course: Course;
  sections: Section[];
}

export default function AvailabilitySurvey({ course, sections }: AvailabilitySurveyProps) {
  const [createSurveyDialog, setCreateSurveyDialog] = useState(false);
  const [survey, loading] = useSurvey(course.surveyID || undefined);
  const [surveyPreviewDialog, setSurveyPreviewDialog] = useState(false);

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
      />
      {survey && (
        <SurveyDialog
          open={surveyPreviewDialog}
          onClose={() => setSurveyPreviewDialog(false)}
          preview={true}
          survey={survey}
        />
      )}
      <Stack direction="row" justifyContent="space-between" mb={1}>
        <Typography variant="h6" fontWeight={600}>
          Availability Survey
        </Typography>
        {!survey && <Button onClick={() => setCreateSurveyDialog(true)}>+ Create Survey</Button>}
      </Stack>
      <Box height={100}>
        {survey && (
          <SurveyCard survey={survey} numStudents={numStudents()} sections={sections} />
        )}
      </Box>
    </>
  );
}
