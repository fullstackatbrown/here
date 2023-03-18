import Button from "@components/shared/Button";
import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField, Typography
} from "@mui/material";
import { DatePicker, DateTimePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import errors from "@util/errors";
import SurveyAPI from "@util/surveys/api";
import { Survey } from "model/survey";
import { FC } from "react";
import { Controller, useForm } from "react-hook-form";
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
    enddate: Date,
    endtime: Date,
};

const getNextWeekDate = () => {
    const nextWeek = new Date()
    nextWeek.setDate(new Date().getDate() + 7)
    nextWeek.setHours(23, 59)
    return nextWeek
}

const CreateEditSurveyDialog: FC<CreateEditSurveyDialogProps> = ({ open, onClose, courseID, survey }) => {
    const { register, handleSubmit, control, reset, formState: { } } = useForm<FormData>({
        defaultValues: {
            name: survey ? survey.name : "Time Availability Survey",
            description: survey ? survey.description : "Please select all the times that you will be available.",
            enddate: survey ? survey.endTime : getNextWeekDate(),
            endtime: survey ? survey.endTime : getNextWeekDate(),
        }
    });

    const onSubmit = handleSubmit(async data => {
        const endDateTime = new Date(
            data.enddate.getFullYear(),
            data.enddate.getMonth(),
            data.enddate.getDate(),
            data.endtime.getHours(),
            data.endtime.getMinutes());
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

    return <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" keepMounted={false}>
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
                    <Box my={2} />
                    <Stack direction="row" spacing={3} pb={4}>
                        <Controller
                            control={control}
                            name="enddate"
                            render={({ field: { onChange, value } }) => (
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="End Date"
                                        value={value}
                                        onChange={onChange}
                                        PopperProps={{ style: { height: '100px' } }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                            )}
                        />
                        <Controller
                            control={control}
                            name="endtime"
                            render={({ field: { onChange, value } }) => (
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <TimePicker
                                        label="End Time"
                                        value={value}
                                        onChange={onChange}
                                        renderInput={(params) => <TextField {...params} />} />
                                </LocalizationProvider>
                            )}
                        />
                    </Stack>
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


