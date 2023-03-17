import Button from "@components/shared/Button";
import {
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
import { FC } from "react";
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
    starttime: Dayjs;
    endtime: Dayjs;
    location: string | null;
    capacity: number | null;
};

const CreateEditSectionDialog: FC<CreateEditSectionDialogProps> = ({ open, onClose, section, courseID }) => {
    const { register, handleSubmit, control, reset, formState: { } } = useForm<FormData>({
        defaultValues: {
            day: section ? section.day : undefined,
            starttime: section ? section.startTime : dayjs('2014-08-18T00:00:00'),
            endtime: section ? section.endTime : dayjs('2014-08-18T00:00:00'),
            location: section ? section.location : undefined,
            capacity: section ? section.capacity : undefined,
        }
    });

    const onSubmit = handleSubmit(async data => {
        console.log(data)
        if (section) {
            toast.promise(SectionAPI.updateSection(
                section.courseID, section.ID, data.day,
                data.starttime.toISOString(),
                data.endtime.toISOString(),
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
            console.log(courseID, data.day,
                data.starttime.toISOString(),
                data.endtime.toISOString(),
                data.location, data.capacity)
            toast.promise(SectionAPI.createSection(
                courseID, data.day,
                data.starttime.toISOString(),
                data.endtime.toISOString(),
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

    return <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" keepMounted={false}>
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
                <Button onClick={onClose}>Cancel</Button>
                <Button type="submit" variant="contained">Add</Button>
            </DialogActions>
        </form>
    </Dialog>;
};

export default CreateEditSectionDialog;


