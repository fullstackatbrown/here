import { FC, useEffect } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
    FormControlLabel,
    Checkbox,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Typography
} from "@mui/material";
import Button from "@components/shared/Button";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import errors from "@util/errors";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useState } from 'react';
import { Survey } from "model/survey";

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
        <DialogTitle>{survey.name}</DialogTitle>
        <DialogContent>
            <Typography variant="body2" mb={2.5}> {survey.description} </Typography>
            <Stack >
                {Array.from(Object.keys(survey.capacity)).map(time =>
                    <FormControlLabel control={<Checkbox onChange={onChangeCheckbox(time)} />} label={time} />
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


