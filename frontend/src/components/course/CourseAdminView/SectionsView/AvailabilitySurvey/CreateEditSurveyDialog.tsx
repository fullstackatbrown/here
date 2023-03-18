import Button from "@components/shared/Button";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField, Typography
} from "@mui/material";
import errors from "@util/errors";
import SurveyAPI from "@util/surveys/api";
import { Survey } from "model/survey";
import { FC } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export interface CreateEditSurveyDialogProps {
    open: boolean;
    onClose: () => void;
    courseID: string;
    survey?: Survey;
}

type FormData = {
    name: string,
    description: string,
};

const CreateEditSurveyDialog: FC<CreateEditSurveyDialogProps> = ({ open, onClose, courseID, survey }) => {
    const { register, handleSubmit, reset, formState: { } } = useForm<FormData>({
        defaultValues: {
            name: survey ? survey.name : "Time Availability Survey",
            description: survey ? survey.description : "Please select all the times that you will be available.",
        }
    });

    const onSubmit = handleSubmit(async data => {
        if (survey) {

        } else {
            toast.promise(SurveyAPI.createSurvey(courseID, data.name, data.description), {
                loading: "Creating survey...",
                success: "Survey created!",
                error: errors.UNKNOWN,
            })
                .then(() => {
                    onClose()
                    reset()
                })
                .catch((err) => {
                    onClose()
                    reset()
                });
        }
    });

    return <Dialog open={open} onClose={onClose} onClick={(e) => e.stopPropagation()} fullWidth maxWidth="sm" keepMounted={false}>
        <form onSubmit={onSubmit}>
            <DialogTitle>
                {survey ? "Update" : "Create"} Survey
            </DialogTitle>
            <DialogContent>
                <Typography variant="body2" mb={2.5}>
                    {survey ? "This will update the survey with the new section times. " :
                        "This will autogenerate a survey from the section times. "}
                    You will be able to see the preview before publishing it.
                </Typography>
                <Stack spacing={2} my={1}>
                    <TextField
                        {...register("name")}
                        multiline
                        required
                        autoFocus
                        label="Survey Name"
                        type="text"
                        fullWidth
                        size="small"
                        variant="standard"
                    />
                    <TextField
                        {...register("description")}
                        multiline
                        required
                        autoFocus
                        label="Description"
                        type="text"
                        fullWidth
                        size="small"
                        variant="standard"
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button type="submit" variant="contained">Submit</Button>
            </DialogActions>
        </form>
    </Dialog>;
};

export default CreateEditSurveyDialog;


