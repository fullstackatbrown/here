import ClearIcon from "@mui/icons-material/Clear";
import CreateIcon from "@mui/icons-material/Create";
import { Box, Card, IconButton, Stack, Typography } from "@mui/material";
import { handleBadRequestError } from "@util/errors";
import SurveyAPI from "api/surveys/api";
import { Section } from "model/section";
import { Survey } from "model/survey";
import { FC, useState } from "react";
import toast from "react-hot-toast";
import CreateSurveyDialog from "./CreateEditSurveyDialog";
import SurveyDialog from "./SurveyDialog";
import SurveyResponsesDialog from "./SurveyResponses/SurveyResponsesDialog";

export interface SurveyCardProps {
  survey: Survey;
  numStudents: number;
  sections: Section[];
}

/**
 * SectionCard is a clickable card that is apart of the home page section grid. Contains the course title, section title,
 * number of tickets, location, and the ending time.
 */
const SurveyCard: FC<SurveyCardProps> = ({ survey, numStudents, sections }) => {
  const [updateSurveyDialog, setUpdateSurveyDialog] = useState(false);
  const [surveyPreviewDialog, setSurveyPreviewDialog] = useState(false);
  const [surveyResponsesDialog, setSUrveyResponsesDialog] = useState(false);

  const handleClick = () => {
    if (survey.published) {
      setSUrveyResponsesDialog(true);
    } else {
      setSurveyPreviewDialog(true);
    }
  };

  const handleCloseSurveyPreview = () => {
    setSurveyPreviewDialog(false);
  };

  const handleDeleteSurvey = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const confirmed = confirm("Are you sure you want to delete this survey?");
    if (confirmed) {
      toast
        .promise(SurveyAPI.deleteSurvey(survey.courseID, survey.ID), {
          loading: "Deleting survey...",
          success: "Survey deleted!",
          error: (err) => handleBadRequestError(err),
        })
        .catch(() => {});
    }
  };

  const handleUpdateSurvey = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setUpdateSurveyDialog(true);
  };

  const getNumResponses = () => (survey.responses ? Object.keys(survey.responses).length : 0);

  return (
    <>
      <CreateSurveyDialog
        open={updateSurveyDialog}
        onClose={() => setUpdateSurveyDialog(false)}
        courseID={survey.courseID}
        survey={survey}
      />
      <SurveyDialog open={surveyPreviewDialog} onClose={handleCloseSurveyPreview} preview={true} survey={survey} />
      <SurveyResponsesDialog
        open={surveyResponsesDialog}
        onClose={() => setSUrveyResponsesDialog(false)}
        survey={survey}
        numStudents={numStudents}
        sections={sections}
      />
      <Card sx={{ ":hover": { boxShadow: 2 } }} onClick={handleClick} variant={"outlined"}>
        <Box display="flex" flexDirection="row" justifyContent="space-between" px={2.5} py={1.5} alignItems="center">
          <Stack spacing={0.5}>
            <Typography variant="body2" noWrap>
              {survey.name}
            </Typography>
            <Typography variant="body2" fontWeight={400} sx={{ color: "text.disabled" }}>
              {survey.published ? `${getNumResponses()}/${numStudents} responded` : "Click to preview"}
            </Typography>
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }}>
            <IconButton onClick={handleUpdateSurvey} size={"small"}>
              <CreateIcon fontSize="small" />
            </IconButton>
            <IconButton onClick={handleDeleteSurvey} size={"small"}>
              <ClearIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      </Card>
    </>
  );
};

export default SurveyCard;
