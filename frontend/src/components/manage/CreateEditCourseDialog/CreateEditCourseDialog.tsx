import Button from "@components/shared/Button";
import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControl,
    InputLabel, MenuItem, Select, Stack,
    TextField
} from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Errors, handleBadRequestError } from "@util/errors";
import SectionAPI from "api/section/api";
import dayjs, { Dayjs } from 'dayjs';
import { FC, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Day, Section } from "model/section";
import { Course } from "model/course";
import CourseAPI from "api/course/api";
import { FormatCourseCode, FormatCourseTerm } from "@util/shared/string";

export interface CreateEditCourseDialogProps {
    open: boolean;
    onClose: () => void;
    course?: Course;
}

type FormData = {
    title: string;
    code: string;
    term: string;
};

const CreateEditCourseDialog: FC<CreateEditCourseDialogProps> = ({ open, onClose, course }) => {
    const defaultValues = {
        title: course ? course.title : undefined,
        code: course ? course.code : undefined,
        term: course ? course.term : undefined,
    }

    const { register, handleSubmit, control, reset, watch, formState: { } } = useForm<FormData>({
        defaultValues: defaultValues
    });

    useEffect(() => { reset(defaultValues) }, [course]);

    const onSubmit = handleSubmit(async data => {
        if (course) {
            toast.promise(CourseAPI.updateCourse(
                course.ID, data.title, FormatCourseCode(data.code), FormatCourseTerm(data.term)),
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
                data.title, FormatCourseCode(data.code), FormatCourseTerm(data.term)),
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
                    <TextField
                        {...register("term")}
                        label="Term"
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
