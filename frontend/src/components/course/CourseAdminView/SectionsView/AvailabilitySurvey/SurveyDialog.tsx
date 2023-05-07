import { useDialog } from "@components/shared/ConfirmDialog/ConfirmDialogProvider";
import {
    Box,
    Button,
    Checkbox, Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControlLabel, Stack,
    Typography
} from "@mui/material";
import { handleBadRequestError } from "@util/errors";
import { formatDateTime } from "@util/shared/formatTime";
import SurveyAPI from "api/surveys/api";
import { Survey } from "model/survey";
import { ChangeEvent, FC, useState } from "react";
import toast from "react-hot-toast";

export interface SurveyDialogContentProps {
    survey: Survey;
    availability?: string[];
    onChangeCheckbox?: (time: string) => (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}

export const SurveyDialogContent: FC<SurveyDialogContentProps> = ({ survey, availability, onChangeCheckbox }) => {
    return <>
        <Typography variant="body1" mb={1}> {survey.description} </Typography>
        <Typography variant="body1" mb={2}> This survey will end on&nbsp;
            <Box component="span" fontWeight='fontWeightMedium'>{formatDateTime(survey.endTime)} </Box>
        </Typography>
        <Stack >
            {survey.options.map(obj =>
                <FormControlLabel
                    key={obj.key}
                    control={<Checkbox onChange={onChangeCheckbox && onChangeCheckbox(obj.key)} />}
                    label={obj.key}
                    checked={availability && availability.includes(obj.key)}
                />
            )}
        </Stack>
    </>
}

export interface SurveyDialogProps {
    open: boolean;
    onClose: () => void;
    preview?: boolean;
    survey: Survey;
    studentID?: string;
}


const SurveyDialog: FC<SurveyDialogProps> = ({ open, onClose, preview = false, survey, studentID }) => {
    // If student has already responded, show their response
    const [availability, setAvailability] = useState<string[]>((studentID && survey?.responses?.[studentID]) || []);
    const showDialog = useDialog();

    const handleClose = () => {
        onClose();
        setAvailability((studentID && survey?.responses?.[studentID]) || [])
    }

    async function onSubmit() {
        if (preview && !survey.published) {
            if (new Date(survey.endTime) < new Date()) {
                alert("This survey's end time is in the past. Please edit before publishing.");
                onClose();
                return;
            }
            const confirmed = await showDialog({
                title: 'Publish Survey',
                message: `Are you sure you want to publish ${survey.name}?`,
            });
            if (confirmed) {
                toast.promise(SurveyAPI.publishSurvey(survey.courseID, survey.ID), {
                    loading: "Publishing survey...",
                    success: "Survey published!",
                    error: "Failed to publish survey"
                })
                    .then(() => handleClose())
                    .catch(() => handleClose())
            }
            return;
        } else {
            if (new Date(survey.endTime) < new Date()) {
                alert("This survey has already ended")
                return;
            }
            if (availability.length === 0) {
                alert("Please select at least one time slot");
                return;
            }
            toast.promise(SurveyAPI.createSurveyResponse(survey.courseID, survey.ID, availability), {
                loading: "Submitting response...",
                success: "Response submitted!",
                error: (err) => handleBadRequestError(err),
            })
                .then(() => onClose()) // if response successful, do not reset to default values
                .catch(() => handleClose())
        }
    }

    function onChangeCheckbox(time: string) {
        return (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
            if (checked) {
                setAvailability([...availability, time])
            } else {
                let newTimes = availability.filter(t => t !== time)
                setAvailability([...newTimes])
            }
        }
    }

    return <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" keepMounted={false}>
        <DialogTitle>{survey.name}{preview && (survey.published ? " (Published)" : " (Preview)")}</DialogTitle>
        <DialogContent>
            <SurveyDialogContent {...{ survey, availability, onChangeCheckbox }} />
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button disabled={preview && survey.published} onClick={onSubmit} variant="contained">
                {preview ? "Publish" : "Submit"}
            </Button>
        </DialogActions>
    </Dialog>;
};

export default SurveyDialog;


