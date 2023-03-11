import React, { FC, useState } from "react";
import { Box, ButtonBase, Card, IconButton, ListItem, ListItemButton, Paper, Stack, Tooltip, Typography } from "@mui/material";
import { Survey } from "model/survey";
import SurveyListItemMenu from "./SurveyListItemMenu";
import SurveyDialog from "./SurveyDialog";

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

  const handleShowSurveyPreview = () => {
    setSurveyPreviewDialog(true)
  }

  const handleCloseSurveyPreview = () => {
    setSurveyPreviewDialog(false)
  }

  return (
    <>
      <SurveyDialog open={surveyPreviewDialog} onClose={handleCloseSurveyPreview} preview={true} survey={survey} />
      <Card sx={{ ':hover': { boxShadow: 2 } }} onClick={handleShowSurveyPreview} variant={"outlined"}>
        <Box display="flex" flexDirection="row" justifyContent="space-between" px={2.5} py={2}>
          <Stack>
            <Typography variant="body1" noWrap>
              {survey.name}
            </Typography>
            <Typography variant="body1" fontWeight={400} sx={{ color: 'text.disabled' }}>
              {survey.published
                ? `${survey.responses.length}/${numStudents} responded`
                : "Unpublished"}
            </Typography>
          </Stack>
          <SurveyListItemMenu survey={survey} />
        </Box>
      </Card >
    </>
  );
};

export default SurveyCard;
