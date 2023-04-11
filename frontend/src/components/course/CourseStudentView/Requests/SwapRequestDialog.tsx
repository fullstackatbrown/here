import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Stack, Switch, TextField, Typography, styled, useTheme } from "@mui/material";
import errors from "@util/errors";
import formatSectionInfo from "@util/shared/formatSectionInfo";
import listToMap from "@util/shared/listToMap";
import { sortSections } from "@util/shared/sortSectionTime";
import SwapAPI from "api/swaps/api";
import { Assignment } from "model/assignment";
import { Course } from "model/course";
import { Section } from "model/section";
import { Swap } from "model/swap";
import { User } from "model/user";
import { FC, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export interface SwapRequestDialogProps {
    open: boolean;
    onClose: () => void;
    course: Course;
    assignments: Assignment[];
    student: User;
    sectionsMap: Record<string, Section>;
    swap?: Swap;
}

type FormData = {
    courseID: string,
    reason: string,
    isPermanent: boolean,
    assignmentID: string,
    oldSectionID: string,
    newSectionID: string,
};

const DisabledTextField = styled(TextField)({
    '& .MuiInput-underline:before': {
        borderBottomColor: 'rgba(0, 0, 0, 0.42)',
        borderBottomWidth: 1,
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: 'rgba(0, 0, 0, 0.42)',
        borderBottomWidth: 1,
    },
    '&:hover .MuiInput-underline:before': {
        borderBottomColor: 'rgba(0, 0, 0, 0.42)',
        borderBottomWidth: 1,
    },
    '&.Mui-focused .MuiInput-underline:before': {
        borderBottomColor: 'rgba(0, 0, 0, 0.42)',
        borderBottomWidth: 1,
    },
    '& .MuiInputLabel-root': {
        color: 'rgba(0, 0, 0, 0.54)',
        fontSize: '1rem',
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: 'rgba(0, 0, 0, 0.54)',
    },
});

const SwapRequestDialog: FC<SwapRequestDialogProps> = ({ open, onClose, course, assignments, student, sectionsMap, swap }) => {
    const defaultValues: FormData = {
        courseID: course.ID,
        isPermanent: swap ? swap.assignmentID === "" : true,
        reason: swap ? swap.reason : "",
        assignmentID: swap ? swap.assignmentID : "",
        oldSectionID: student.defaultSection[course.ID],
        newSectionID: swap ? swap.newSectionID : "",
    }

    const { register, handleSubmit, setValue, control, reset, watch, unregister, formState: { } } = useForm<FormData>({
        defaultValues: defaultValues
    })

    const watchIsPermanent = watch("isPermanent")
    const watchAssignmentID = watch("assignmentID")
    const watchOldSectionID = watch("oldSectionID")

    useEffect(() => {
        if (watchIsPermanent) {
            // If permanent swap, unregister assignmentID and set oldSectionID to current default section
            unregister("assignmentID")
            const currentSectionID = getCurrentSectionID(watchAssignmentID)
            setValue("oldSectionID", currentSectionID)
        } else {
            // If temporary swap, register assignmentID and set oldSectionID to empty
            register("assignmentID")
            setValue("oldSectionID", "")
        }
        setValue("newSectionID", defaultValues["newSectionID"])
        setValue("reason", defaultValues["reason"])
    }, [watchIsPermanent]);

    useEffect(() => {
        if (watchAssignmentID === "") {
            // If user did not select an assignment, set oldSectionID to empty
            setValue("oldSectionID", "")
        } else {
            // If user selected an assignment, set oldSectionID to the section for that assignment
            const currentSectionID = getCurrentSectionID(watchAssignmentID)
            setValue("oldSectionID", currentSectionID)
        }
    }, [watchAssignmentID]);

    useEffect(() => {
        reset(defaultValues);
    }, [student, swap])

    const handleOnClose = () => {
        onClose()
        reset()
    }

    const onSubmit = handleSubmit(async data => {
        if (swap) {
            // Update a swap
            toast.promise(SwapAPI.updateSwap(data.courseID, swap.ID, data.newSectionID, data.assignmentID, data.reason),
                {
                    loading: "Updating request...",
                    success: "Request updated!",
                    error: errors.UNKNOWN
                })
                .then(() => handleOnClose())
                .catch(() => handleOnClose())
        } else {
            // create a swap
            toast.promise(SwapAPI.createSwap(data.courseID, data.oldSectionID, data.newSectionID, data.assignmentID, data.reason),
                {
                    loading: "Submitting request...",
                    success: "Request requested!",
                    error: errors.UNKNOWN
                })
        }
    })

    const getCurrentSectionID = (assignmentID): string => {
        if ((assignmentID) && (student.actualSection[assignmentID])) {
            return student.actualSection[course.ID][assignmentID]
        } else {
            return student.defaultSection[course.ID]
        }
    }

    return <Dialog open={open} onClose={handleOnClose}>
        <form onSubmit={onSubmit}>
            <DialogTitle>Request Swap</DialogTitle>
            <DialogContent>
                <Typography variant="body1" mb={2}>
                    Swaps are automatically accepted if the requested section has availability,&nbsp;
                    otherwise an instructor will handle the request manually.
                </Typography>
                <Stack spacing={2} my={1}>
                    <DisabledTextField
                        required
                        autoFocus
                        label="Course"
                        type="text"
                        fullWidth
                        size="small"
                        variant="standard"
                        defaultValue={`${course.code} ${course.title}`}
                        InputProps={{ readOnly: true }}
                    />
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body1">Permanent</Typography>
                        <Controller
                            name="isPermanent"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <Switch
                                    checked={value}
                                    onChange={(e) => onChange(e.target.checked)}
                                />
                            )} />
                    </Stack>
                    {!watchIsPermanent &&
                        <FormControl fullWidth variant="standard">
                            <InputLabel id="assignment-select-label">Assignment</InputLabel>
                            <Select
                                labelId="assignment-select-label"
                                {...register("assignmentID")}
                                label="Assignment"
                                required
                            >
                                {/* TODO: filter assignment to remove all past assignments */}
                                {assignments.map((a) => <MenuItem key={`select-assignment-${a.ID}`} value={a.ID}>{a.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                    }
                    <Controller
                        name="oldSectionID"
                        control={control}
                        render={({ field: { value } }) => (
                            <DisabledTextField
                                label="Current Section"
                                type="text"
                                fullWidth
                                size="small"
                                value={value === "" ? "" : formatSectionInfo(sectionsMap[value] as Section)}
                                variant="standard"
                                InputProps={{ readOnly: true, }}
                            />
                        )} />
                    <Controller
                        name="newSectionID"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <FormControl fullWidth variant="standard">
                                <InputLabel id="new-section-select-label">Section to Switch To</InputLabel>
                                <Select
                                    labelId="new-section-select-label"
                                    label="Section to Switch To"
                                    required
                                    onChange={onChange}
                                    value={value}
                                >
                                    {sectionsMap && sortSections(Object.values(sectionsMap)).map((s) => {
                                        return <MenuItem
                                            key={`select-section-${s.ID}`}
                                            value={s.ID}
                                            disabled={s.ID === watchOldSectionID}
                                        >
                                            {formatSectionInfo(s)}
                                        </MenuItem>
                                    }
                                    )}
                                </Select>
                            </FormControl>
                        )} />
                    <TextField
                        {...register("reason")}
                        multiline
                        required
                        autoFocus
                        label="Reason"
                        type="text"
                        fullWidth
                        size="small"
                        variant="standard"
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleOnClose}>Cancel</Button>
                <Button type="submit" variant="contained">Submit</Button>
            </DialogActions>
        </form>
    </Dialog>

}

export default SwapRequestDialog;