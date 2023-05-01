import { DisabledTextField } from "@components/shared/DisabledTextField/DisabledTextField";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Stack, Switch, TextField, Typography } from "@mui/material";
import { handleBadRequestError } from "@util/errors";
import CourseAPI from "api/course/api";
import { Course, CourseStatus } from "model/course";
import { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export interface ActivateCourseDialogProps {
    course: Course;
    open: boolean;
    onClose: () => void;
}

type FormData = {
    code: string;
    title: string;
    term: string;
    autoApproveRequests: boolean;
    status: string;
};

const ActivateCourseDialog: FC<ActivateCourseDialogProps> = ({ course, open, onClose }) => {
    const defaultValues = {
        code: course.code,
        title: course.title,
        term: course.term,
        autoApproveRequests: course.autoApproveRequests,
        status: CourseStatus.CourseActive
    }

    const { register, handleSubmit, control, reset, watch, formState: { } } = useForm<FormData>({
        defaultValues: defaultValues
    });

    const handleOnClose = () => {
        onClose()
        reset()
    }

    const onSubmit = handleSubmit(data => {
        toast.promise(CourseAPI.updateCourse(course.ID, data.title, data.autoApproveRequests, data.status), {
            loading: "Activating course on Here...",
            success: "Course activated on Here",
            error: (err) => handleBadRequestError(err)
        })
            .then(() => handleOnClose())
            .catch(() => { })
    });

    return <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <form onSubmit={onSubmit}>
            <DialogTitle>Activate Course on Here</DialogTitle>
            <DialogContent>
                <Stack spacing={2} mt={1} mb={3}>
                    <Stack direction="row" display="flex" justifyContent="space-between" spacing={4}>
                        <DisabledTextField
                            {...register("code")}
                            label="Course code"
                            type="text"
                            fullWidth
                            size="small"
                            variant="standard"
                            InputProps={{ readOnly: true }}
                        />
                        <DisabledTextField
                            {...register("term")}
                            label="Term"
                            type="text"
                            fullWidth
                            size="small"
                            variant="standard"
                            InputProps={{ readOnly: true }}
                        />
                    </Stack>
                    <TextField
                        {...register("title")}
                        required
                        label="Course title"
                        type="text"
                        fullWidth
                        size="small"
                        variant="standard"
                    />
                </Stack>
                <Stack direction="row" display="flex" justifyContent="space-between">
                    <Stack direction="column" maxWidth="80%">
                        <Typography fontSize={14} fontWeight={500}>
                            Auto-Approve Swap Requests
                        </Typography>
                        <Typography fontSize={14} color="secondary">
                            If this feature is turned on, swap requests will be automatically approved if the capacity is not reached.
                        </Typography>
                    </Stack>
                    <Controller
                        name="autoApproveRequests"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <FormControlLabel
                                control={<Switch />}
                                label=""
                                labelPlacement="start"
                                checked={value}
                                onChange={onChange}
                            />
                        )}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button type="submit" variant="contained">Activate</Button>
            </DialogActions>
        </form>
    </Dialog>;
};

export default ActivateCourseDialog;


