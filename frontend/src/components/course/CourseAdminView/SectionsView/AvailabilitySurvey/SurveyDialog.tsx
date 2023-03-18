import Button from "@components/shared/Button";
import {
    Box,
    Checkbox, Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControlLabel, Stack, Typography
} from "@mui/material";
import { formatDateTime } from "@util/shared/formatTime";
import { sortSurveyTimes } from "@util/shared/sortSectionTime";
import { Survey } from "model/survey";
import { FC, useState } from "react";

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
            const confirmed = confirm("Are you sure you want to publish this survey?");
            onClose();
            return;
            // TODO: publish survey
        } else {
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
                        label={time}
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


