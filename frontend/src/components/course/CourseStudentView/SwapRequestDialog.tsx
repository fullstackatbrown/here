import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Stack, Switch, TextField, Typography } from "@mui/material";
import formatSectionInfo from "@util/shared/formatSectionInfo";
import sectionListToMap from "@util/shared/sectionListToMap";
import { sortSections } from "@util/shared/sortSectionTime";
import { Assignment } from "model/assignment";
import { Course } from "model/course";
import { Section } from "model/section";
import { User } from "model/user";
import { FC, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

export interface SwapRequestDialogProps {
    open: boolean;
    onClose: () => void;
    course: Course;
    assignments: Assignment[];
    student: User;
    sections: Section[];
}

type FormData = {
    courseID: string,
    reason: string,
    isPermanent: boolean,
    assignmentID: string,
    oldSectionID: string,
    newSectionID: string,
};

const SwapRequestDialog: FC<SwapRequestDialogProps> = ({ open, onClose, course, assignments, student, sections }) => {
    const defaultValues: FormData = {
        courseID: course.ID,
        isPermanent: true,
        reason: "",
        assignmentID: "",
        oldSectionID: student.defaultSection[course.ID],
        newSectionID: "",
    }

    const { register, handleSubmit, setValue, control, reset, watch, unregister, formState: { } } = useForm<FormData>({
        defaultValues: defaultValues
    })

    const watchIsPermanent = watch("isPermanent")
    const watchAssignmentID = watch("assignmentID")
    const watchOldSectionID = watch("oldSectionID")

    useEffect(() => {
        if (watchIsPermanent) {
            unregister("assignmentID")
            const currentSectionID = getCurrentSectionID(watchAssignmentID)
            setValue("oldSectionID", currentSectionID)
        } else {
            register("assignmentID")
            setValue("oldSectionID", "")
        }
        setValue("newSectionID", "")
        setValue("reason", "")
    }, [watchIsPermanent]);

    useEffect(() => {
        if (watchAssignmentID === "") {
            setValue("oldSectionID", "")
        } else {
            const currentSectionID = getCurrentSectionID(watchAssignmentID)
            setValue("oldSectionID", currentSectionID)
        }
    }, [watchAssignmentID]);

    useEffect(() => {
        reset(defaultValues);
    }, [student])

    const handleOnClose = () => {
        onClose()
        reset()
    }

    const onSubmit = handleSubmit(async data => {
        // const assignmentID = isPermanent ? undefined : data.assignmentID

        // onClose()
        // reset()
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
                    <TextField
                        required
                        autoFocus
                        label="Course"
                        type="text"
                        fullWidth
                        size="small"
                        variant="standard"
                        defaultValue={`${course.code} ${course.title}`}
                        InputProps={{ readOnly: true, }}
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
                                {assignments.map((a) => <MenuItem key={`select-assignment-${a.ID}`} value={a.ID}>{a.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                    }
                    <Controller
                        name="oldSectionID"
                        control={control}
                        render={({ field: { value } }) => (
                            <TextField
                                label="Current Section"
                                type="text"
                                fullWidth
                                size="small"
                                value={value === "" ? "" : formatSectionInfo(sectionListToMap(sections)[value])}
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
                                    {sections && sortSections(sections).map((s) => {
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
                    {/* <FormControl fullWidth variant="standard">
                        <InputLabel id="new-section-select-label">Section to Switch To</InputLabel>
                        <Select
                            labelId="new-section-select-label"
                            {...register("newSectionID")}
                            label="Section to Switch To"
                            required
                        >
                            {sections && sortSections(sections).map((s) => {
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
                    </FormControl> */}
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