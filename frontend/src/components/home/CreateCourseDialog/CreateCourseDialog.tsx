import Button from "@components/shared/Button";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, Stack,
    TextField
} from "@mui/material";
import { FC } from "react";
import { useForm } from "react-hook-form";

export interface JoinCourseDialogProps {
    open: boolean;
    onClose: () => void;
}

type FormData = {
    accessCode: string;
};

const JoinCourseDialog: FC<JoinCourseDialogProps> = ({ open, onClose }) => {
    const { register, handleSubmit, control, reset, formState: { } } = useForm<FormData>();

    const onSubmit = handleSubmit(async data => {
        // TODO: submit form 
        console.log(data)
    });

    return <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" keepMounted={false}>
        <form onSubmit={onSubmit}>

            <DialogTitle>Join Course with Entry Code</DialogTitle>
            <DialogContent>
                <Stack spacing={2} my={1}>
                    <TextField
                        {...register("accessCode")}
                        autoFocus
                        label="Course Entry Code"
                        type="text"
                        fullWidth
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button type="submit" variant="contained">Join Course</Button>
            </DialogActions>
        </form>
    </Dialog>;
};

export default JoinCourseDialog;


