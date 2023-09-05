import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Stack, Switch, TextField, Typography } from "@mui/material";
import { DatePicker, DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Errors, handleBadRequestError } from "@util/errors";
import { getNextWeekDate } from '@util/shared/time';
import AssignmentAPI from "api/assignment/api";
import dayjs from "dayjs";
import { Assignment } from 'model/assignment';
import { Course } from "model/course";
import { FC, useEffect, useMemo } from "react";
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
    releaseDate: dayjs.Dayjs;
    dueDate: dayjs.Dayjs;
    maxScore: number;
};

const CreateEditAssignmentDialog: FC<CreateEditAssignmentDialogProps> = ({ open, onClose, course, assignment }) => {
    const defaultValues = useMemo(() => ({
        name: assignment ? assignment.name : undefined,
        optional: assignment ? assignment.optional : false,
        releaseDate: assignment ? dayjs(assignment.releaseDate) : dayjs(new Date()),
        dueDate: assignment ? dayjs(assignment.dueDate) : dayjs(getNextWeekDate()),
        maxScore: assignment ? assignment.maxScore : 1,
    }), [assignment])

    const { register, handleSubmit, control, reset, setError, clearErrors, formState: { errors } } = useForm<FormData>({
        defaultValues: defaultValues
    });

    useEffect(() => { reset(defaultValues) }, [defaultValues, reset]);

    const onSubmit = handleSubmit(async data => {
        if (data.releaseDate > data.dueDate) {
            toast.error("Release date must be before due date.")
            return
        }

        const releaseDate = data.releaseDate.toISOString()
        const dueDate = data.dueDate.toISOString()

        if (assignment) {
            // Check if there are changes
            if (assignment.name === data.name &&
                assignment.optional === data.optional &&
                assignment.releaseDate.toISOString() === releaseDate &&
                assignment.dueDate.toISOString() === dueDate &&
                assignment.maxScore === data.maxScore) {
                handleOnClose()
                toast.success("No changes made!")
                return
            }
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

    const validateAndSubmit = () => {
        if (errors) {
            let error = "Please fix the following errors: \n"
            for (const key in errors) {
                error += "- "
                error += errors[key].message
                error += "\n"
            }
            toast.error(error, { style: { whiteSpace: "pre-line" } })
            return
        }
        onSubmit()
    }

    return <Dialog open={open} fullWidth maxWidth="sm" keepMounted={false}>
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
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Controller
                                control={control}
                                name="releaseDate"
                                render={({ field: { onChange, value } }) => (
                                    <DateTimePicker
                                        label="Release Date"
                                        value={value}
                                        onChange={onChange}
                                        views={['year', 'month', 'day', 'hours', 'minutes']}
                                        onError={(e) => {
                                            if (e) setError("releaseDate", {
                                                type: "manual",
                                                message: "Invalid Release Date Value",
                                            })
                                            else clearErrors("releaseDate")
                                        }}
                                    />
                                )}
                            />
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Controller
                                control={control}
                                name="dueDate"
                                render={({ field: { onChange, value } }) => (
                                    <DateTimePicker
                                        label="Due Date"
                                        value={value}
                                        onChange={onChange}
                                        disablePast
                                        views={['year', 'month', 'day', 'hours', 'minutes']}
                                        onError={(e) => {
                                            if (e) setError("dueDate", {
                                                type: "manual",
                                                message: "Invalid Due Date Value",
                                            })
                                            else clearErrors("dueDate")
                                        }}
                                    />
                                )}
                            />
                        </LocalizationProvider>
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
                <Button onClick={validateAndSubmit} variant="contained">{assignment ? "Update" : "Add"}</Button>
            </DialogActions>
        </form>
    </Dialog>
}

export default CreateEditAssignmentDialog;