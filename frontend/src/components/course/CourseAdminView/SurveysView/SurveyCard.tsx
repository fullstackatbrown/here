import { useDialog } from "@components/shared/ConfirmDialog/ConfirmDialogProvider";
import ClearIcon from "@mui/icons-material/Clear";
import CreateIcon from "@mui/icons-material/Create";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Card, Grid, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { handleBadRequestError } from "@util/errors";
import SurveyAPI from "api/surveys/api";
import { Section } from "model/section";
import { Survey } from "model/survey";
import { FC, useState } from "react";
import toast from "react-hot-toast";
import CreateEditSurveyDialog from "./CreateEditSurveyDialog/CreateEditSurveyDialog";
import SurveyDialog from "./SurveyDialog";
import SurveyResponsesDialog from "./SurveyResponses/SurveyResponsesDialog";
import SurveyStatusChip from "./SurveyStatusChip";
import { CourseUserData } from "model/course";

export interface SurveyCardProps {
  survey: Survey;
  numStudents: number;
  sectionsMap: Record<string, Section>;
  active: boolean;
  admin: boolean;
  students: Record<string, CourseUserData>;
}

/**
 * SectionCard is a clickable card that is apart of the home page section grid. Contains the course title, section title,
 * number of tickets, location, and the ending time.
 */
const SurveyCard: FC<SurveyCardProps> = ({ survey, numStudents, sectionsMap, active, admin, students }) => {
  const [updateSurveyDialog, setUpdateSurveyDialog] = useState(false);
  const [surveyPreviewDialog, setSurveyPreviewDialog] = useState(false);
  const [surveyResponsesDialog, setSurveyResponsesDialog] = useState(false);
  const showDialog = useDialog();

  const handleClick = () => {
    if (survey.published) {
      setSurveyResponsesDialog(true);
    } else {
      setSurveyPreviewDialog(true);
    }
  };

  const handleCloseSurveyPreview = () => {
    setSurveyPreviewDialog(false);
  };

  const handleDeleteSurvey = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const confirmed = await showDialog({
      title: `Confirm Delete Survey?`,
      warning: survey.published && "This survey is already published. Deleting this survey will delete all student responses.",
      message: "This action cannot be undone."
    });
    if (confirmed) {
      toast
        .promise(SurveyAPI.deleteSurvey(survey.courseID, survey.ID), {
          loading: "Deleting survey...",
          success: "Survey deleted!",
          error: (err) => handleBadRequestError(err),
        })
        .catch(() => { });
    }
  };

  const handleUpdateSurvey = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setUpdateSurveyDialog(true);
  };

  const handleShowPreview = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setSurveyPreviewDialog(true);
  };

  const getNumResponses = () => (survey.responses ? Object.keys(survey.responses).length : 0);

  return (
    <>
      <CreateEditSurveyDialog
        open={updateSurveyDialog}
        onClose={() => setUpdateSurveyDialog(false)}
        courseID={survey.courseID}
        survey={survey}
        sections={Object.values(sectionsMap)}
      />
      <SurveyDialog open={surveyPreviewDialog} onClose={handleCloseSurveyPreview} preview={true} survey={survey} />
      <SurveyResponsesDialog
        open={surveyResponsesDialog}
        onClose={() => setSurveyResponsesDialog(false)}
        survey={survey}
        numStudents={numStudents}
        sectionsMap={sectionsMap}
        students={students}
      />
      <Card sx={{ ":hover": { boxShadow: 2 } }} onClick={handleClick} variant={"outlined"}>
        <Box display="flex" flexDirection="row" justifyContent="space-between" px={2.5} py={1.5} alignItems="center">
          <Stack spacing={0.5}>
            <Typography variant="body2" display="inline-block" lineHeight={2} sx={{ verticalAlign: "middle" }}>
              {survey.name}&nbsp;&nbsp;
              <SurveyStatusChip survey={survey} />
            </Typography>
            <Typography variant="body2" fontWeight={400} sx={{ color: "text.disabled" }}>
              {survey.published ? `${getNumResponses()}/${numStudents} responded` : "Click to preview and publish"}
            </Typography>
          </Stack>

          <Stack display="flex" direction="row" justifyContent="flex-end">
            {survey.published &&
              <Tooltip title="Preview">
                <IconButton onClick={handleShowPreview} size={"small"} disabled={!active} sx={{ marginRight: 0.5, marginTop: 0.3 }}>
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            }
            {admin && <>
              <IconButton onClick={handleUpdateSurvey} size={"small"} disabled={!active}>
                <CreateIcon fontSize="small" />
              </IconButton>
              <IconButton onClick={handleDeleteSurvey} size={"small"} disabled={!active}>
                <ClearIcon fontSize="small" />
              </IconButton>
            </>
            }
          </Stack>

        </Box>
      </Card>
    </>
  );
};

export default SurveyCard;
