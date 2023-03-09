import { FC } from "react";
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
import QueueAPI from "@util/queue/api";
import { toast } from "react-hot-toast";
import errors from "@util/errors";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useState } from 'react';

export interface CreateSectionDialogProps {
    open: boolean;
    onClose: () => void;
}

type FormData = {
    name: string,
    description: string,
};

const CreateSectionDialog: FC<CreateSectionDialogProps> = ({ open, onClose }) => {
    const { register, handleSubmit, control, reset, formState: { } } = useForm<FormData>({
        defaultValues: {
            name: "Time Availability Survey",
            description: "Please select all the times that you will be available.",
        }
    });
    const onSubmit = handleSubmit(async data => {
        // TODO: submit form 
        console.log(data)
    });

    return <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" keepMounted={false}>
        <form onSubmit={onSubmit}>

            <DialogTitle>Create Section</DialogTitle>
            <DialogContent>
                <Typography variant="body2" mb={2.5}>
                    This will autogenerate a survey from the section times. You will be able to see the preview before publishing it.
                </Typography>
                <Stack spacing={2} my={1}>
                    <TextField
                        {...register("name")}
                        multiline
                        required
                        autoFocus
                        label="Survey Name"
                        type="text"
                        fullWidth
                        size="small"
                        variant="standard"
                    />
                    <TextField
                        {...register("description")}
                        multiline
                        required
                        autoFocus
                        label="Description"
                        type="text"
                        fullWidth
                        size="small"
                        variant="standard"
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button type="submit" variant="contained">Create</Button>
            </DialogActions>
        </form>
    </Dialog>;
};

export default CreateSectionDialog;


