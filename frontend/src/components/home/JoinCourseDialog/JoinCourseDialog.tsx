import Button from "@components/shared/Button";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, Stack,
    TextField
} from "@mui/material";
import AuthAPI, { ChangeCourseAction } from "api/auth/api";
import { FC } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export interface JoinCourseDialogProps {
    open: boolean;
    onClose: () => void;
}

type FormData = {
    entryCode: string;
};

const JoinCourseDialog: FC<JoinCourseDialogProps> = ({ open, onClose }) => {
    const { register, handleSubmit, control, reset, formState: { } } = useForm<FormData>();

    const onSubmit = handleSubmit(async data => {
        toast.promise(AuthAPI.joinOrQuitCourse("p3d5eSnr3H621G3SwzEL", data.entryCode, ChangeCourseAction.Join), {
            loading: "Joining Course...",
            success: "Joined Course!",
            error: (err) => `${err.response.data}`,
        })
            .then(() => {
                onClose();
                reset();
            })
            .catch(() => {
                onClose();
                reset();
            })
    });

    const handleOnClose = () => {
        // Reset the form before closing the dialog
        reset();
        onClose();
    };

    return <Dialog open={open} onClose={handleOnClose} fullWidth maxWidth="sm" keepMounted={false}>
        <form onSubmit={onSubmit}>

            <DialogTitle>Join Course with Entry Code</DialogTitle>
            <DialogContent>
                <Stack spacing={2} my={1}>
                    <TextField
                        {...register("entryCode")}
                        autoFocus
                        label="Course Entry Code"
                        type="text"
                        fullWidth
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleOnClose}>Cancel</Button>
                <Button type="submit" variant="contained">Join Course</Button>
            </DialogActions>
        </form>
    </Dialog>;
};

export default JoinCourseDialog;


