import { Box, Button, Card, Paper, Stack, Typography } from "@mui/material";
import { Course } from "model/general";
import { Survey } from "model/survey";
import { useEffect, useState } from "react";
import CreateSurveyDialog from "./CreateSurveyDialog";
import SurveyCard from "./SurveyCard";
import SurveyDialog from "./SurveyDialog";

export interface AvailabilitySurveyProps {
  course: Course;
}

const exampleSurvey: Survey = {
  id: "tempid",
  courseID: "tempcourseid",
  name: "Time Availability Survey",
  description: "Please select all the times that you are available for",
  capacity: new Map(),
  responses: new Map(),
  numResponses: 0,
  published: true,
};

exampleSurvey.capacity.set("Tuesday 3-5PM", 20);
exampleSurvey.capacity.set("Wednesday 6-8PM", 40);
exampleSurvey.capacity.set("Friday 6-8PM", 40);

export default function AvailabilitySurvey({
  course,
}: AvailabilitySurveyProps) {
  const [createSurveyDialog, setCreateSurveyDialog] = useState(false);
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [surveyPreviewDialog, setSurveyPreviewDialog] = useState(false);

  useEffect(() => {
    // TODO: get survey id from backend

    // Uncomment this for testing UI
    setSurvey(exampleSurvey);
  }, []);

  return (
    <>
      <CreateSurveyDialog
        open={createSurveyDialog}
        onClose={() => setCreateSurveyDialog(false)}
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
        {survey ? (
          // TODO:
          <Button onClick={() => {}}>Update Survey</Button>
        ) : (
          <Button onClick={() => setCreateSurveyDialog(true)}>
            + Create Survey
          </Button>
        )}
      </Stack>
      <Box height={100}>
        {survey && (
          <SurveyCard survey={survey} numStudents={course.students.length} />
        )}
      </Box>
    </>
  );
}
