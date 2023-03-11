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
    InputLabel
} from "@mui/material";
import Button from "@components/shared/Button";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { Controller, useForm } from "react-hook-form";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useState } from 'react';

export interface CreateSectionDialogProps {
    open: boolean;
    onClose: () => void;
}

type FormData = {
    day: string;
    starttime: Dayjs;
    endtime: Dayjs;
    location: string | null;
    capacity: string | null;
};

const CreateSectionDialog: FC<CreateSectionDialogProps> = ({ open, onClose }) => {
    const { register, handleSubmit, control, reset, formState: { } } = useForm<FormData>({
        defaultValues: {
            starttime: dayjs('2014-08-18T00:00:00'),
            endtime: dayjs('2014-08-18T00:00:00'),
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
                <Stack spacing={2} my={1}>
                    <FormControl fullWidth>
                        <InputLabel id="weekday-select-label">Day</InputLabel>
                        <Select
                            labelId="weekday-select-label"
                            {...register("day")}
                            label="Day"
                            required
                        >
                            <MenuItem value={"Sunday"}>Sunday</MenuItem>
                            <MenuItem value={"Monday"}>Monday</MenuItem>
                            <MenuItem value={"Tuesday"}>Tuesday</MenuItem>
                            <MenuItem value={"Wednesday"}>Wednesday</MenuItem>
                            <MenuItem value={"Thursday"}>Thursday</MenuItem>
                            <MenuItem value={"Friday"}>Friday</MenuItem>
                            <MenuItem value={"Saturday"}>Saturday</MenuItem>
                        </Select>
                    </FormControl>
                    <Controller
                        control={control}
                        name="starttime"
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimePicker
                                    label="Start Time"
                                    value={value}
                                    onChange={onChange}
                                    renderInput={(params) => <TextField {...params} />} />
                            </LocalizationProvider>
                        )}
                    />
                    <Controller
                        control={control}
                        name="endtime"
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimePicker
                                    label="End Time"
                                    value={value}
                                    onChange={onChange}
                                    renderInput={(params) => <TextField {...params} />} />
                            </LocalizationProvider>
                        )}
                    />
                    <TextField
                        {...register("location")}
                        autoFocus
                        label="Location"
                        type="text"
                        fullWidth
                    />
                    <TextField
                        {...register("capacity")}
                        label="Capacity"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button type="submit" variant="contained">Add</Button>
            </DialogActions>
        </form>
    </Dialog>;
};

export default CreateSectionDialog;


