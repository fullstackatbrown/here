import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField
} from "@mui/material";
import { handleBadRequestError } from "@util/errors";
import { formatCourseCode, formatCourseTerm, parseCourseTerm, validateCourseCode } from "@util/shared/string";
import CourseAPI from "api/course/api";
import { Course } from "model/course";
import { FC, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import TermTextfield from "../TermTextfield/TermTextfield";
import { Season, getCurrentTerm } from "@util/shared/terms";

export interface CreateEditCourseDialogProps {
    open: boolean;
    onClose: () => void;
    course?: Course;
    courseTerm?: string;
}

type FormData = {
    title: string;
    code: string;
    term: [Season, string];
};

const CreateEditCourseDialog: FC<CreateEditCourseDialogProps> = ({ open, onClose, course, courseTerm = getCurrentTerm() }) => {
    const defaultValues = useMemo(() => ({
        title: course ? course.title : undefined,
        code: course ? course.code : undefined,
        term: course ? parseCourseTerm(course.term) : parseCourseTerm(courseTerm),
    }), [course, courseTerm])

    const { register, handleSubmit, reset, setValue, getValues, watch, formState: { } } = useForm<FormData>({
        defaultValues: defaultValues
    });

    const watchTerm = watch('term');

    useEffect(() => { reset(defaultValues) }, [defaultValues, reset]);

    const onSubmit = handleSubmit(async data => {
        if (!validateCourseCode(data.code)) {
            toast.error("Invalid course code");
            return;
        }
        const code = formatCourseCode(data.code)
        const term = formatCourseTerm(data.term)
        if (course) {
            // Check if there are changes
            if (course.title === data.title &&
                course.code === code &&
                course.term === term) {
                handleOnClose()
                toast.success("No changes made!")
                return
            }
            toast.promise(CourseAPI.updateCourseInfo(
                course.ID, data.title, code, term),
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

    return <Dialog open={open} fullWidth maxWidth="sm" keepMounted={false}>
        <form onSubmit={onSubmit}>
            <DialogTitle>{course ? "Edit" : "Create"} Course</DialogTitle>
            <DialogContent>
                <Stack spacing={2} my={1}>
                    <TermTextfield
                        term={watchTerm}
                        setTerm={(term: [Season, string]) => { setValue("term", term) }}
                    />
                    <TextField
                        {...register("code")}
                        label="Course Code"
                        placeholder="cs1300"
                        type="text"
                        fullWidth
                        required
                        autoFocus
                    />
                    <TextField
                        {...register("title")}
                        label="Name"
                        placeholder="User Interface and User Experience"
                        type="text"
                        fullWidth
                        required
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
