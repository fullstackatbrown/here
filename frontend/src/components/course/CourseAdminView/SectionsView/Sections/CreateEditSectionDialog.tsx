import Button from "@components/shared/Button";
import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControl,
    InputLabel, MenuItem, Select, Stack,
    TextField
} from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import errors from "@util/errors";
import SectionAPI from "@util/section/api";
import dayjs, { Dayjs } from 'dayjs';
import { FC, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Day, Section } from "model/section";

export interface CreateEditSectionDialogProps {
    open: boolean;
    onClose: () => void;
    section?: Section;
    courseID?: string;
}

type FormData = {
    day: Day;
    starttime: string;
    endtime: string;
    location: string | null;
    capacity: number | null;
};

const CreateEditSectionDialog: FC<CreateEditSectionDialogProps> = ({ open, onClose, section, courseID }) => {
    const defaultValues = {
        day: section ? section.day : undefined,
        starttime: section ? section.startTime : '2001-01-01T05:00:00.000Z',
        endtime: section ? section.endTime : '2001-01-01T05:00:00.000Z',
        location: section ? section.location : undefined,
        capacity: section ? section.capacity : undefined,
    }

    const { register, handleSubmit, control, reset, formState: { } } = useForm<FormData>({
        defaultValues: defaultValues
    });

    useEffect(() => { reset(defaultValues) }, [section]);

    const onSubmit = handleSubmit(async data => {
        const startTime = new Date(data.starttime).toISOString()
        const endTime = new Date(data.endtime).toISOString()
        if (section) {
            toast.promise(SectionAPI.updateSection(
                section.courseID, section.ID, data.day,
                startTime, endTime,
                data.location, data.capacity),
                {
                    loading: "Updating section...",
                    success: "Section updated!",
                    error: errors.UNKNOWN
                })
                .then(() => {
                    onClose();
                    reset();
                })
                .catch(() => {
                    onClose();
                    reset();
                });
        } else {
            toast.promise(SectionAPI.createSection(
                courseID, data.day,
                startTime, endTime,
                data.location, data.capacity),
                {
                    loading: "Creating section...",
                    success: "section created!",
                    error: (err) => `This just happened: ${err.toString()}`,
                    // TODO: change to errors.UNKNOWN
                })
                .then(() => {
                    onClose();
                    reset();
                })
                .catch(() => {
                    onClose();
                    reset();
                });

        }
    });

    const handleOnClose = () => {
        onClose()
        reset()
    }

    return <Dialog open={open} onClose={handleOnClose} fullWidth maxWidth="sm" keepMounted={false}>
        <form onSubmit={onSubmit}>
            <DialogTitle>{section ? "Edit" : "Create"} Section</DialogTitle>
            <DialogContent>
                <Stack spacing={2} my={1}>
                    <FormControl fullWidth>
                        <InputLabel id="weekday-select-label">Day</InputLabel>
                        <Select
                            labelId="weekday-select-label"
                            {...register("day")}
                            label="Day"
                            required
                            value={section ? section.day : undefined}
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
                    <Stack direction="row" spacing={2}>
                        <Controller
                            control={control}
                            name="starttime"
                            render={({ field: { onChange, value } }) => (
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <TimePicker
                                        label="Start Time"
                                        value={value}
                                        onChange={onChange}
                                        renderInput={(params) => <TextField fullWidth {...params} />}
                                    />
                                </LocalizationProvider>
                            )}
                        />
                        <Controller
                            control={control}
                            name="endtime"
                            render={({ field: { onChange, value } }) => (
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <TimePicker
                                        label="End Time"
                                        value={value}
                                        onChange={onChange}
                                        renderInput={(params) => <TextField fullWidth {...params} />}
                                    />
                                </LocalizationProvider>
                            )}
                        />
                    </Stack>
                    <TextField
                        {...register("location")}
                        label="Location"
                        type="text"
                        fullWidth
                    />
                    <TextField
                        {...register("capacity", { valueAsNumber: true })}
                        label="Capacity"
                        type="number"
                        required
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleOnClose}>Cancel</Button>
                <Button type="submit" variant="contained">{section ? "Update" : "Add"}</Button>
            </DialogActions>
        </form>
    </Dialog>;
};

export default CreateEditSectionDialog;


