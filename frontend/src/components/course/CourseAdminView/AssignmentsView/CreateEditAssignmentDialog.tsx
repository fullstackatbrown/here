import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Stack, Switch, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Errors, handleBadRequestError } from "@util/errors";
import { getNextWeekDate } from '@util/shared/time';
import AssignmentAPI from "api/assignment/api";
import { Assignment } from 'model/assignment';
import { Course } from "model/course";
import { FC, useEffect } from "react";
import { Controller, useForm } from 'react-hook-form';
import toast from "react-hot-toast";

export interface CreateEditAssignmentDialogProps {
    open: boolean;
    onClose: () => void;
    course: Course,
    assignment?: Assignment;
}

type FormData = {
    name: string | null;
    optional: boolean;
    releaseDate: string;
    dueDate: string;
    maxScore: number;
};

const CreateEditAssignmentDialog: FC<CreateEditAssignmentDialogProps> = ({ open, onClose, course, assignment }) => {
    const defaultValues = {
        name: assignment ? assignment.name : undefined,
        optional: assignment ? assignment.optional : false,
        releaseDate: assignment ? assignment.releaseDate.toISOString() : new Date().toISOString(),
        dueDate: assignment ? assignment.dueDate.toISOString() : getNextWeekDate().toISOString(),
        maxScore: assignment ? assignment.maxScore : 1,
    }

    const { register, handleSubmit, control, reset, formState: { } } = useForm<FormData>({
        defaultValues: defaultValues
    });

    useEffect(() => { reset(defaultValues) }, [assignment]);

    const clearTime = (isoTime: string) => {
        const date = new Date(isoTime)
        date.setHours(0, 0, 0, 0)
        return date.toISOString()
    }

    const onSubmit = handleSubmit(async data => {
        const releaseDate = clearTime(data.releaseDate)
        const dueDate = clearTime(data.dueDate)
        if (releaseDate > dueDate) {
            toast.error("Release date must be before due date.")
            return
        }
        if (assignment) {
            toast.promise(AssignmentAPI.updateAssignment(
                assignment.courseID, assignment.ID, data.name, data.optional, releaseDate, dueDate, data.maxScore),
                {
                    loading: "Updating assignment...",
                    success: "Assignment updated!",
                    error: (err) => handleBadRequestError(err)
                })
                .then(() => handleOnClose())
                .catch(() => { })
        } else {
            toast.promise(AssignmentAPI.createAssignment(
                course.ID, data.name, data.optional, releaseDate, dueDate, data.maxScore),
                {
                    loading: "Creating assignment...",
                    success: "Assignment created!",
                    error: (err) => handleBadRequestError(err)
                })
                .then(() => handleOnClose())
                .catch(() => { })
        }
    })

    const handleOnClose = () => {
        onClose()
        reset()
    }

    return <Dialog open={open} onClose={handleOnClose} fullWidth maxWidth="sm" keepMounted={false}>
        <form onSubmit={onSubmit}>
            <DialogTitle>{assignment ? "Edit" : "Create"} Assignment</DialogTitle>
            <DialogContent>
                <Stack spacing={2} my={1}>
                    <TextField
                        {...register("name")}
                        autoFocus
                        label="Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        placeholder="New Assignment"
                        required
                    />
                    <Stack direction="row" spacing={4}>
                        <Controller
                            control={control}
                            name="releaseDate"
                            render={({ field: { onChange, value } }) => (
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Release Date"
                                        value={value}
                                        onChange={onChange}
                                        renderInput={(params) => <TextField fullWidth required variant="standard" {...params} />}
                                    />
                                </LocalizationProvider>
                            )}
                        />
                        <Controller
                            control={control}
                            name="dueDate"
                            render={({ field: { onChange, value } }) => (
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Due Date"
                                        value={value}
                                        onChange={onChange}
                                        renderInput={(params) => <TextField fullWidth required variant="standard" {...params} />}
                                    />
                                </LocalizationProvider>
                            )}
                        />
                    </Stack>
                    <Stack direction="row" spacing={4} alignItems="flex-end">
                        <TextField
                            {...register("maxScore", { valueAsNumber: true })}
                            label="Max Score"
                            type="number"
                            required
                            fullWidth
                            variant="standard"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <Controller
                            name="optional"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <FormControlLabel
                                    control={<Switch />}
                                    label="Optional"
                                    labelPlacement="start"
                                    checked={value}
                                    onChange={onChange}
                                />
                            )}
                        />
                    </Stack>
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleOnClose}>Cancel</Button>
                <Button type="submit" variant="contained">{assignment ? "Update" : "Add"}</Button>
            </DialogActions>
        </form>
    </Dialog>
}

export default CreateEditAssignmentDialog;