import * as React from 'react';
import { FC } from "react";

import { Box, Button, Stack, Switch, Typography } from "@mui/material";
import { TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { LocalizationProvider, DateField, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Assignment } from 'model/assignment';
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
        startDate: assignment ? assignment.startDate : '2001-01-01T05:00:00.000Z',
        endDate: assignment ? assignment.endDate : '2001-01-01T05:00:00.000Z',
        maxScore: assignment ? assignment.maxScore : 1,
    }

    const { register, handleSubmit, control, reset, formState: { } } = useForm<FormData>({
        defaultValues: defaultValues
    });

    React.useEffect(() => { reset(defaultValues) }, [assignment]);

    const onSubmit = handleSubmit(async data => {
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
                    />
                    <Controller
                        control={control}
                        name="startDate"
                        render={({ field: { onChange, value } }) => (
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimePicker
                                    label="End Time"
                                    value={value}
                                    onChange={onChange}
                                    renderInput={(params) => <TextField variant="standard" {...params} />}
                                />
                            </LocalizationProvider>
                        )}
                    />
                    <TextField
                        {...register("maxScore", { valueAsNumber: true })}
                        label="Max Score"
                        type="number"
                        required
                        variant="standard"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body1">Permanent</Typography>
                        <Controller
                            name="optional"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <Switch
                                    checked={value}
                                    onChange={(e) => onChange(e.target.checked)}
                                />
                            )} />
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