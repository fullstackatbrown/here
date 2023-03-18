import Button from "@components/shared/Button";
import {
    Checkbox, Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControlLabel, Stack, Typography
} from "@mui/material";
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
            onClose();
            return;
        }
        // TODO: submit form
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
            <Typography variant="body2" mb={2.5}> {survey.description} </Typography>
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
            <Button onClick={onSubmit} variant="contained">Submit</Button>
        </DialogActions>
    </Dialog>;
};

export default SurveyDialog;


