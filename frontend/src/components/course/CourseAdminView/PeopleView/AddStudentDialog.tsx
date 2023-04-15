import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    TextField
} from "@mui/material";
import CourseAPI from "api/course/api";
import { Course } from "model/course";
import { FC } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export interface AddStudentDialogDialogProps {
    course: Course;
    open: boolean;
    onClose: () => void;
}

type FormData = {
    email: string;
};


const AddStudentDialogDialog: FC<AddStudentDialogDialogProps> = ({ course, open, onClose }) => {
    const { register, handleSubmit, control, reset, formState: { } } = useForm<FormData>()

    const handleOnClose = () => {
        reset();
        onClose();
    };

    const onSubmit = handleSubmit(async data => {
        toast.promise(CourseAPI.addStudent(course.ID, data.email), {
            loading: "Adding student...",
            success: "Student added!",
            error: (err) => err.message
        }).then(() => handleOnClose())
    })

    return <Dialog open={open} onClose={handleOnClose} fullWidth maxWidth="sm" keepMounted={false}>
        <DialogTitle>Add Student</DialogTitle>
        <DialogContent>
            <form onSubmit={onSubmit}>
                <TextField
                    {...register("email")}
                    placeholder="Student Email"
                    required
                    fullWidth
                    variant="standard"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <Button type="submit">Add</Button>
            </form>
        </DialogContent>

    </Dialog>;
};

export default AddStudentDialogDialog;


