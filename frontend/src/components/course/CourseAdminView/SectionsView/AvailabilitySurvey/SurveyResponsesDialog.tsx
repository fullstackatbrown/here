import {
    Checkbox, Dialog, DialogContent,
    DialogTitle, FormControlLabel, Stack, Typography
} from "@mui/material";
import { Survey } from "model/survey";
import { FC, useState } from "react";

export interface SurveyResponsesDialogProps {
    open: boolean;
    onClose: () => void;
    survey: Survey;
}


const SurveyResponsesDialog: FC<SurveyResponsesDialogProps> = ({ open, onClose, survey }) => {
    const [times, setTimes] = useState<string[]>([]);

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
        <DialogTitle>{survey.name} (Responses)</DialogTitle>
        <DialogContent>


        </DialogContent>
    </Dialog>;
};

export default SurveyResponsesDialog;


