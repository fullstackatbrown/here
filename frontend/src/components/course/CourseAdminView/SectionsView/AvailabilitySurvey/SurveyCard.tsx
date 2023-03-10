import React, { FC, useState } from "react";
import { Box, ButtonBase, IconButton, ListItem, ListItemButton, Paper, Stack, Tooltip, Typography } from "@mui/material";
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
      <ListItem
        // key={value}
        secondaryAction={
          <SurveyListItemMenu survey={survey} />
          // <IconButton edge="end" aria-label="comments">
          //   <CommentIcon />
          // </IconButton>
        }
        disablePadding
      >
        <ListItemButton role={undefined} onClick={handleShowSurveyPreview} dense>
          {/* <Paper style={{ padding: 16 }} square>
      <Box display="flex" flexDirection="row" justifyContent="space-between"> */}
          <Stack>
            <Typography variant="body1" noWrap>
              {survey.name}
            </Typography>
            <Typography variant="body1" fontWeight={400} color="lightgray">
              {survey.published
                ? `${survey.responses.length}/${numStudents} responded`
                : "Unpublished"}
            </Typography>
          </Stack>
        </ListItemButton>

        {/* </Box>
      </Paper > */}
      </ListItem >
    </>
  );
};

export default SurveyCard;
