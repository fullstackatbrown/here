import { Box, Card, Stack, Typography } from "@mui/material";
import { Survey } from "model/survey";
import { FC, useState } from "react";
import SurveyDialog from "./SurveyDialog";
import SurveyListItemMenu from "./SurveyListItemMenu";
import SurveyResponsesDialog from "./SurveyResponsesDialog";

export interface SurveyCardProps {
  survey: Survey;
  numStudents: number;
}

/**
 * SectionCard is a clickable card that is apart of the home page section grid. Contains the course title, section title,
 * number of tickets, location, and the ending time.
 */
const SurveyCard: FC<SurveyCardProps> = ({ survey, numStudents }) => {
  const [surveyPreviewDialog, setSurveyPreviewDialog] = useState(false)
  const [surveyResponsesDialog, setSUrveyResponsesDialog] = useState(false)

  const handleClick = () => {
    if (survey.published) {
      setSUrveyResponsesDialog(true)
    } else {
      setSurveyPreviewDialog(true)
    }
  }

  const handleCloseSurveyPreview = () => {
    setSurveyPreviewDialog(false)
  }

  return (
    <>
      <SurveyDialog open={surveyPreviewDialog} onClose={handleCloseSurveyPreview} preview={true} survey={survey} />
      <SurveyResponsesDialog open={surveyResponsesDialog} onClose={() => setSUrveyResponsesDialog(false)} survey={survey} />
      <Card sx={{ ':hover': { boxShadow: 2 } }} onClick={handleClick} variant={"outlined"}>
        <Box display="flex" flexDirection="row" justifyContent="space-between" px={2.5} py={2} alignItems={"center"}>
          <Stack>
            <Typography variant="body1" noWrap>
              {survey.name}
            </Typography>
            <Typography variant="body1" fontWeight={400} sx={{ color: 'text.disabled' }}>
              {survey.published
                ? `${Object.keys(survey.responses).length}/${numStudents} responded`
                : "Click to preview"}
            </Typography>
          </Stack>
          <SurveyListItemMenu survey={survey} />
        </Box>
      </Card >
    </>
  );
};

export default SurveyCard;
