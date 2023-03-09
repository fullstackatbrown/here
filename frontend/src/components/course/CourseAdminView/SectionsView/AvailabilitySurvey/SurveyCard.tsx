import React, { FC } from "react";
import { Box, ButtonBase, Paper, Stack, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ClearIcon from "@mui/icons-material/Clear";
import { Survey } from "model/survey";
import { Section } from "model/general";

export interface SurveyCardProps {
  survey: Survey;
  numStudents: number;
}

/**
 * SectionCard is a clickable card that is apart of the home page section grid. Contains the course title, section title,
 * number of tickets, location, and the ending time.
 */
const SurveyCard: FC<SurveyCardProps> = ({ survey, numStudents }) => {
  return (
    <Paper
      variant="elevation"
      elevation={1}
      style={{
        padding: 16,
      }}
      square
    >
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Stack>
          <Typography variant="body1" noWrap>
            {survey.name}
          </Typography>
          <Typography variant="body1" fontWeight={400} color="lightgray">
            {survey.published
              ? `${survey.numResponses}/${numStudents} responded`
              : "Unpublished"}
          </Typography>
        </Stack>
        <Stack display={"flex"} direction="row" spacing={1}>
          {!survey.published && (
            <ButtonBase
              onClick={() => console.log("handle publishing the survey...")}
              focusRipple
            >
              <SendIcon />
            </ButtonBase>
          )}
          <ButtonBase
            onClick={() => console.log("handle deleting the survey...")}
            focusRipple
          >
            <ClearIcon />
          </ButtonBase>
        </Stack>
      </Box>
    </Paper>
  );
};

export default SurveyCard;
