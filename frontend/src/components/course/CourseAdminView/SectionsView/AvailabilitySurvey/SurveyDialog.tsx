import Button from "@components/shared/Button";
import {
    Box,
    Checkbox, Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControlLabel, Stack, Typography
} from "@mui/material";
import { formatDateTime, formatSurveyTime } from "@util/shared/formatTime";
import { sortSurveyTimes } from "@util/shared/sortSectionTime";
import SurveyAPI from "@util/surveys/api";
import { Survey } from "model/survey";
import { FC, useState } from "react";
import toast from "react-hot-toast";

export interface SurveyDialogProps {
    open: boolean;
    onClose: () => void;
    preview: boolean;
    survey: Survey;
}


const SurveyDialog: FC<SurveyDialogProps> = ({ open, onClose, preview, survey }) => {
    const [times, setTimes] = useState<string[]>([]);

    function onSubmit() {
        if (preview) {
            if (new Date(survey.endTime) < new Date()) {
                alert("This survey's end time is in the past. Please edit before publishing.");
                onClose();
                return;
            }
            const confirmed = confirm("Are you sure you want to publish this survey?");
            if (confirmed) {
                toast.promise(SurveyAPI.publishSurvey(survey.courseID, survey.ID), {
                    loading: "Publishing survey...",
                    success: "Survey published!",
                    error: "Failed to publish survey"
                });
            }
            onClose();
            return;
        } else {
            if (new Date(survey.endTime) < new Date()) {
                alert("This survey has already ended")
                return;
            }
            if (times.length === 0) {
                alert("Please select at least one time slot");
                return;
            }
            // TODO: submit form
        }
    }

    function onChangeCheckbox(time: string) {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.checked) {
                setTimes([...times, time])
            } else {
                let newTimes = times.filter(t => t !== time)
                setTimes([...newTimes])
            }
        }
    }

    return <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" keepMounted={false}>
        <DialogTitle>{survey.name}{preview && " (Preview)"}</DialogTitle>
        <DialogContent>
            <Typography variant="body1" mb={1}> {survey.description} </Typography>
            <Typography variant="body1" mb={2}> This survey will end on&nbsp;
                <Box component="span" fontWeight='fontWeightMedium'>{formatDateTime(survey.endTime)} </Box>
            </Typography>
            <Stack >
                {sortSurveyTimes(Object.keys(survey.capacity)).map(time =>
                    <FormControlLabel
                        control={<Checkbox onChange={onChangeCheckbox(time)} />}
                        label={formatSurveyTime(time)}
                    />
                )}
            </Stack>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={onSubmit} variant="contained">{preview ? "Publish" : "Submit"}</Button>
        </DialogActions>
    </Dialog>;
};

export default SurveyDialog;


