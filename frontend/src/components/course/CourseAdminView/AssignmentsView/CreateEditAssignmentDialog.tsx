import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Stack, Switch, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { getNextWeekDate } from '@util/shared/time';
import { Assignment } from 'model/assignment';
import { FC, useEffect } from "react";
import { Controller, useForm } from 'react-hook-form';

export interface CreateEditAssignmentDialogProps {
    open: boolean;
    onClose: () => void;
    assignment?: Assignment;
}

type FormData = {
    name: string | null;
    optional: boolean;
    startDate: string;
    endDate: string;
    maxScore: number;
};

const CreateEditAssignmentDialog: FC<CreateEditAssignmentDialogProps> = ({ open, onClose, assignment }) => {
    const defaultValues = {
        name: assignment ? assignment.name : undefined,
        optional: assignment ? assignment.optional : false,
        startDate: assignment ? assignment.startDate : new Date().toISOString(),
        endDate: assignment ? assignment.endDate : getNextWeekDate().toISOString(),
        maxScore: assignment ? assignment.maxScore : 1,
    }

    const { register, handleSubmit, control, reset, formState: { } } = useForm<FormData>({
        defaultValues: defaultValues
    });

    useEffect(() => { reset(defaultValues) }, [assignment]);

    const onSubmit = handleSubmit(async data => {
        console.log(data)
        // TODO: submit form
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
                            name="startDate"
                            render={({ field: { onChange, value } }) => (
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="End Date"
                                        value={value}
                                        onChange={onChange}
                                        renderInput={(params) => <TextField fullWidth required variant="standard" {...params} />}
                                    />
                                </LocalizationProvider>
                            )}
                        />
                        <Controller
                            control={control}
                            name="endDate"
                            render={({ field: { onChange, value } }) => (
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="End Time"
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
                <Button type="submit" variant="contained">{assignment ? "Submit" : "Add"}</Button>
            </DialogActions>
        </form>
    </Dialog>
}

export default CreateEditAssignmentDialog;