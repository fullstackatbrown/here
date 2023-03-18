import { Box, Card, IconButton, Stack, Typography } from "@mui/material";
import { Survey } from "model/survey";
import { FC, useState } from "react";
import SurveyDialog from "./SurveyDialog";
import SurveyListItemMenu from "./SurveyListItemMenu";
import CreateIcon from "@mui/icons-material/Create";
import ClearIcon from "@mui/icons-material/Clear";
import CreateSurveyDialog from "./CreateEditSurveyDialog";
import SurveyResponsesDialog from "./SurveyResponses/SurveyResponsesDialog";
import toast from "react-hot-toast";
import SurveyAPI from "@util/surveys/api";
import errors from "@util/errors";

export interface SurveyCardProps {
  survey: Survey;
  numStudents: number;
}

/**
 * SectionCard is a clickable card that is apart of the home page section grid. Contains the course title, section title,
 * number of tickets, location, and the ending time.
 */
const SurveyCard: FC<SurveyCardProps> = ({ survey, numStudents }) => {
  const [updateSurveyDialog, setUpdateSurveyDialog] = useState(false);
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

  const handleDeleteSurvey = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    const confirmed = confirm("Are you sure you want to delete this survey?");
    if (confirmed) {
      toast.promise(SurveyAPI.deleteSurvey(survey.courseID, survey.ID), {
        loading: "Deleting survey...",
        success: "Survey deleted!",
        error: errors.UNKNOWN
      })
    }
  }

  const handleUpdateSurvey = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setUpdateSurveyDialog(true)
  }

  return (
    <>
      <CreateSurveyDialog open={updateSurveyDialog} onClose={() => setUpdateSurveyDialog(false)} courseID={survey.courseID} survey={survey} />
      <SurveyDialog open={surveyPreviewDialog} onClose={handleCloseSurveyPreview} preview={true} survey={survey} />
      <SurveyResponsesDialog open={surveyResponsesDialog} onClose={() => setSUrveyResponsesDialog(false)} survey={survey} numStudents={numStudents} />
      <Card sx={{ ':hover': { boxShadow: 2 } }} onClick={handleClick} variant={"outlined"}>
        <Box display="flex" flexDirection="row" justifyContent="space-between" px={2.5} py={1.5} alignItems={"center"}>
          <Stack>
            <Typography variant="body2" noWrap>
              {survey.name}
            </Typography>
            <Typography variant="body2" fontWeight={400} sx={{ color: 'text.disabled' }}>
              {survey.published
                ? `${Object.keys(survey.responses).length}/${numStudents} responded`
                : "Click to preview"}
            </Typography>
          </Stack>
          <Stack display={"flex"} direction="row" spacing={4}>
            <div>
              <IconButton onClick={handleUpdateSurvey} size={"small"}>
                <CreateIcon fontSize="small" />
              </IconButton >
              <IconButton onClick={handleDeleteSurvey} size={"small"}>
                <ClearIcon fontSize="small" />
              </IconButton>
            </div>
          </Stack>
          {/* <SurveyListItemMenu survey={survey} /> */}
        </Box>
      </Card >
    </>
  );
};

export default SurveyCard;
