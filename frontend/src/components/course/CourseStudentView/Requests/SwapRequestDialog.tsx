import { DisabledTextField } from "@components/shared/DisabledTextField/DisabledTextField";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Stack, Switch, TextField, Typography, styled } from "@mui/material";
import { handleBadRequestError } from "@util/errors";
import { filterAssignmentsByDueDate, filterAssignmentsByReleaseDate } from "@util/shared/assignments";
import formatSectionInfo from "@util/shared/section";
import { sortSections } from "@util/shared/sortSectionTime";
import SwapAPI from "api/swaps/api";
import { Assignment } from "model/assignment";
import { Course } from "model/course";
import { Section } from "model/section";
import { Swap } from "model/swap";
import { User } from "model/user";
import { FC, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { SwapStatus } from "model/swap";

export interface SwapRequestDialogProps {
    open: boolean;
    onClose: () => void;
    course: Course;
    assignmentsMap: Record<string, Assignment>;
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

const SwapRequestDialog: FC<SwapRequestDialogProps> = ({ open, onClose, course, assignmentsMap, student, sectionsMap, swap }) => {
    const assignments = Object.values(assignmentsMap)
    const defaultValues: FormData = useMemo(() => ({
        courseID: course.ID,
        isPermanent: swap ? swap.assignmentID === "" : true,
        reason: swap ? swap.reason : "",
        assignmentID: swap ? swap.assignmentID : "",
        oldSectionID: student.defaultSections?.[course.ID] ? student.defaultSections[course.ID] : "",
        newSectionID: swap ? swap.newSectionID : "",
    }), [course, student, swap])

    const { register, handleSubmit, setValue, control, reset, watch, unregister, formState: { } } = useForm<FormData>({
        defaultValues: defaultValues
    })

    const watchIsPermanent = watch("isPermanent")
    const watchAssignmentID = watch("assignmentID")
    const watchOldSectionID = watch("oldSectionID")

    const currentSectionID = useMemo(() => {
        if ((watchAssignmentID) && (student.actualSections?.[course.ID]?.[watchAssignmentID])) {
            return student.actualSections?.[course.ID][watchAssignmentID]
        } else {
            return student.defaultSections?.[course.ID]
        }
    }, [watchAssignmentID, student, course])

    useEffect(() => {
        if (watchIsPermanent) {
            // If permanent swap, unregister assignmentID and set oldSectionID to current default section
            unregister("assignmentID")
            setValue("oldSectionID", currentSectionID)
        } else {
            // If temporary swap, register assignmentID and set oldSectionID to empty
            register("assignmentID")
            setValue("oldSectionID", "")
        }
        setValue("newSectionID", defaultValues["newSectionID"])
        setValue("reason", defaultValues["reason"])
    }, [watchIsPermanent, defaultValues, register, unregister, setValue, currentSectionID]);

    useEffect(() => {
        if (watchAssignmentID !== "") {
            // If user selected an assignment, set oldSectionID to the section for that assignment
            setValue("oldSectionID", currentSectionID)
        }
    }, [watchAssignmentID, setValue, currentSectionID]);

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
                    error: (err) => handleBadRequestError(err)
                })
                .then(() => handleOnClose())
                .catch(() => handleOnClose())
        } else {
            // create a swap
            toast.promise(SwapAPI.createSwap(data.courseID, data.oldSectionID, data.newSectionID, data.assignmentID, data.reason),
                {
                    loading: "Submitting request...",
                    success: (res) => res === SwapStatus.Approved ? "Request approved!" : "Request submitted",
                    error: (err) => handleBadRequestError(err)
                })
                .then(() => {
                    handleOnClose()
                }
                )
                .catch(() => handleOnClose())
        }
    })

    return <Dialog open={open} onClose={handleOnClose} fullWidth>
        <form onSubmit={onSubmit}>
            <DialogTitle>Request Swap</DialogTitle>
            <DialogContent>
                {course.autoApproveRequests ?
                    <Typography variant="body1" mb={2}>
                        Swaps are automatically accepted if the requested section has availability,&nbsp;
                        otherwise a staff member will handle the request manually.
                    </Typography> :
                    <Typography variant="body1" mb={2}>
                        All swaps requests for the course will be handled manually by a staff member.
                    </Typography>
                }
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
                                    // Cannot change isPermanent if swap is already created
                                    disabled={swap !== undefined}
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
                                defaultValue={defaultValues["assignmentID"]}
                                required
                            >
                                {filterAssignmentsByReleaseDate(filterAssignmentsByDueDate(assignments))
                                    .map((a) => <MenuItem key={`select-assignment-${a.ID}`} value={a.ID}>{a.name}</MenuItem>)}
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