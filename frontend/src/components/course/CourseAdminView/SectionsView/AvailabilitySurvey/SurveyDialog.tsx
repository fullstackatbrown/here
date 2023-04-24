import Button from "@components/shared/Button";
import { useDialog } from "@components/shared/ConfirmDialog/ConfirmDialogProvider";
import {
    Box,
    Checkbox, Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControlLabel, Stack, Typography
} from "@mui/material";
import { handleBadRequestError } from "@util/errors";
import { formatDateTime, formatSurveyTime } from "@util/shared/formatTime";
import { sortSurveyTimes } from "@util/shared/sortSectionTime";
import SurveyAPI from "api/surveys/api";
import { Survey } from "model/survey";
import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";

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
        if (preview) {
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
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.checked) {
                setAvailability([...availability, time])
            } else {
                let newTimes = availability.filter(t => t !== time)
                setAvailability([...newTimes])
            }
        }
    }

    return <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" keepMounted={false}>
        <DialogTitle>{survey.name}{preview && " (Preview)"}</DialogTitle>
        <DialogContent>
            <Typography variant="body1" mb={1}> {survey.description} </Typography>
            <Typography variant="body1" mb={2}> This survey will end on&nbsp;
                <Box component="span" fontWeight='fontWeightMedium'>{formatDateTime(survey.endTime)} </Box>
            </Typography>
            <Stack >
                {sortSurveyTimes(Object.keys(survey.capacity)).map(time =>
                    <FormControlLabel
                        key={time}
                        control={<Checkbox onChange={onChangeCheckbox(time)} />}
                        label={formatSurveyTime(time)}
                        checked={availability.includes(time)}
                    />
                )}
            </Stack>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={onSubmit} variant="contained">{preview ? "Publish" : "Submit"}</Button>
        </DialogActions>
    </Dialog>;
};

export default SurveyDialog;


