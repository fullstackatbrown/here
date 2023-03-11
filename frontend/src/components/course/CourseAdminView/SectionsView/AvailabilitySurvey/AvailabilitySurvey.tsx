import { Box, Button, Card, Paper, Stack, Typography } from "@mui/material";
import { Course } from "model/course";
import { Survey } from "model/survey";
import { useEffect, useState } from "react";
import CreateSurveyDialog from "./CreateSurveyDialog";
import SurveyCard from "./SurveyCard";
import SurveyDialog from "./SurveyDialog";

export interface AvailabilitySurveyProps {
  course: Course;
}

const exampleSurvey: Survey = {
  ID: "",
  courseID: "CSCI 1470",
  name: "Time Availability Survey",
  description: "Please choose all the times that you are available for.",
  endTime: new Date('March 30, 2023 03:00:00'),
  capacity: { "Tuesday 2-3pm": { "section1": 30 }, "Wednesday 2-3pm": { "section2": 50 } },
  responses: { "student1": ["Tuesday 2-3pm"], "student2": ["Tuesday 2-3pm, Wednesday 2-3pm"] },
  published: false,
}

export default function AvailabilitySurvey({
  course,
}: AvailabilitySurveyProps) {
  const [createSurveyDialog, setCreateSurveyDialog] = useState(false);
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [surveyPreviewDialog, setSurveyPreviewDialog] = useState(false);

  useEffect(() => {
    // Uncomment this for testing UI
    if (course.surveyID != "") {
      // TODO: get survey from backend
      setSurvey(exampleSurvey);
    }

  }, [course]);

  return (
    <>
      <CreateSurveyDialog
        open={createSurveyDialog}
        onClose={() => setCreateSurveyDialog(false)}
        update={false}
      />
      {survey && (
        <SurveyDialog
          open={surveyPreviewDialog}
          onClose={() => setSurveyPreviewDialog(false)}
          preview={true}
          survey={survey}
        />
      )}
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h6" fontWeight={600}>
          Availability Survey
        </Typography>
        {!survey && <Button onClick={() => setCreateSurveyDialog(true)}>+ Create Survey</Button>}
      </Stack>
      <Box height={100} my={2}>
        {survey && (
          <SurveyCard survey={survey} numStudents={Object.keys(course.students).length} />
        )}
      </Box>
    </>
  );
}
