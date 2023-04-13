import Button from "@components/shared/Button";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField
} from "@mui/material";
import { handleBadRequestError } from "@util/errors";
import { formatCourseCode, formatCourseTerm } from "@util/shared/string";
import CourseAPI from "api/course/api";
import { Course } from "model/course";
import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export interface CreateEditCourseDialogProps {
    open: boolean;
    onClose: () => void;
    course?: Course;
    courseTerm?: string;
}

type FormData = {
    title: string;
    code: string;
    term: string;
};

const CreateEditCourseDialog: FC<CreateEditCourseDialogProps> = ({ open, onClose, course, courseTerm }) => {
    const defaultValues = {
        title: course ? course.title : undefined,
        code: course ? course.code : undefined,
        term: course ? course.term : courseTerm,
    }

    const { register, handleSubmit, control, reset, watch, formState: { } } = useForm<FormData>({
        defaultValues: defaultValues
    });

    useEffect(() => { reset(defaultValues) }, [course]);

    const onSubmit = handleSubmit(async data => {
        if (course) {
            toast.promise(CourseAPI.updateCourse(
                course.ID, data.title, formatCourseCode(data.code), formatCourseTerm(data.term)),
                {
                    loading: 'Updating course...',
                    success: 'Course updated!',
                    error: (err) => handleBadRequestError(err)
                }
            )
                .then(() => handleOnClose())
                .catch(() => { })
        } else {
            toast.promise(CourseAPI.createCourse(
                data.title, formatCourseCode(data.code), formatCourseTerm(data.term)),
                {
                    loading: 'Creating course...',
                    success: 'Course created!',
                    error: (err) => handleBadRequestError(err)
                }
            )
                .then(() => handleOnClose())
                .catch(() => { })
        }
    });

    const handleOnClose = () => {
        onClose()
        reset()
    }

    return <Dialog open={open} onClose={handleOnClose} fullWidth maxWidth="sm" keepMounted={false}>
        <form onSubmit={onSubmit}>
            <DialogTitle>{course ? "Edit" : "Create"} Course</DialogTitle>
            <DialogContent>
                <Stack spacing={2} my={1}>
                    {/* TODO: better way to enter term, string is too dangerous, or find a way to validate */}
                    <TextField
                        {...register("term")}
                        label="Term"
                        type="text"
                        fullWidth
                    />
                    <TextField
                        {...register("title")}
                        label="Name"
                        type="text"
                        fullWidth
                    />
                    <TextField
                        {...register("code")}
                        label="Course Code"
                        type="text"
                        fullWidth
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleOnClose}>Cancel</Button>
                <Button type="submit" variant="contained">{course ? "Update" : "Add"}</Button>
            </DialogActions>
        </form>
    </Dialog>;
};

export default CreateEditCourseDialog;
