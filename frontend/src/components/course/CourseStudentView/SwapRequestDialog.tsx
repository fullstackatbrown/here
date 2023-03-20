import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Stack, TextField, Switch, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Box } from "@mui/material";
import formatSectionTime from "@util/shared/formatTime";
import sectionListToMap from "@util/shared/sectionListToMap";
import { sortSections } from "@util/shared/sortSectionTime";
import { Assignment } from "model/assignment";
import { Course } from "model/course";
import { Section } from "model/section";
import { User } from "model/user";
import { FC, useEffect, useState } from "react";
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
    const [isPermanent, setIsPermanent] = useState(false);
    const { register, handleSubmit, getValues, setValue, control, reset, watch, formState: { } } = useForm<FormData>({
        defaultValues: {
            courseID: course.ID,
            isPermanent: false,
            reason: "",
            assignmentID: "",
            oldSectionID: "",
            newSectionID: "",
        }
    })

    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            if (name === "assignmentID") {
                if (getValues["assignmentID"] === "") {
                    setValue("oldSectionID", "")
                    return
                }
                const currentSectionID = getCurrentSectionID(value.assignmentID)
                setValue("oldSectionID", currentSectionID)
            }
        });
        return () => subscription.unsubscribe();
    }, [watch]);


    const handleTogglePermanent = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsPermanent(event.target.checked);
    };

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
                        <Switch checked={getValues["isPermanent"]} onChange={handleTogglePermanent} />
                        {/* <Controller
                            name="isPermanent"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <Switch
                                    checked={value}
                                    onChange={(e) => onChange(e.target.checked)}
                                />
                            )} /> */}
                    </Stack>
                    {!isPermanent &&
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
                                value={value && value !== "" && formatSectionTime(sectionListToMap(sections)[value])}
                                variant="standard"
                                InputProps={{ readOnly: true, }}
                            />
                        )} />
                    <FormControl fullWidth variant="standard">
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
                                    disabled={s.ID === getValues("oldSectionID")}
                                >
                                    {formatSectionTime(s)}
                                </MenuItem>
                            }
                            )}
                        </Select>
                    </FormControl>
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