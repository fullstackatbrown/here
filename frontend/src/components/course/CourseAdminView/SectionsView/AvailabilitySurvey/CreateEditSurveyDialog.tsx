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
import { FC, useEffect } from "react";
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
            enddate: survey ? new Date(survey.endTime) : getNextWeekDate(),
            endtime: survey ? new Date(survey.endTime) : getNextWeekDate(),
        }
    });

    useEffect(() => {
        reset({
            name: survey ? survey.name : "Time Availability Survey",
            description: survey ? survey.description : "Please select all the times that you will be available.",
            enddate: survey ? new Date(survey.endTime) : getNextWeekDate(),
            endtime: survey ? new Date(survey.endTime) : getNextWeekDate(),
        });
    }, [survey]);

    const onSubmit = handleSubmit(async data => {
        const endDate = new Date(data.enddate)
        const endTime = new Date(data.endtime)
        endDate.setHours(endTime.getHours(), endTime.getMinutes())
        if (endDate < new Date()) {
            toast.error("The time you selected is in the past.")
            return
        }
        if (survey) {
            toast.promise(SurveyAPI.updateSurvey(courseID, survey.ID, data.name, data.description, endDate.toISOString()), {
                loading: "Updating survey...",
                success: "Survey updated!",
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
        } else {
            toast.promise(SurveyAPI.createSurvey(courseID, data.name, data.description, endDate.toISOString()), {
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

    const handleOnClose = () => {
        onClose()
        reset()
    }

    const getInstructionText = () => {
        if (survey) {
            if (!survey.published) {
                return "This will update the survey with the new section times. You will be able to see the preview before publishing it."
            } else {
                return "This will update the existing survey and sync it with the section times. Keep in mind that the survey is already published."
            }
        } else {
            return "This will autogenerate a survey from the section times. You will be able to see the preview before publishing it."
        }
    }

    return <Dialog open={open} onClose={handleOnClose} fullWidth maxWidth="sm" keepMounted={false}>
        <form onSubmit={onSubmit}>
            <DialogTitle>
                {survey ? "Update" : "Create"} Survey
            </DialogTitle>
            <DialogContent>
                <Typography variant="body1" mb={2}>
                    {getInstructionText()}
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
                    <Stack direction="row" spacing={3} pt={1} pb={4}>
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
                                        renderInput={(params) => <TextField variant="standard" {...params} />}
                                        minDate={new Date()}
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
                                        renderInput={(params) => <TextField variant="standard" {...params} />} />
                                </LocalizationProvider>
                            )}
                        />
                    </Stack>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleOnClose}>Cancel</Button>
                <Button type="submit" variant="contained">{survey ? "Update" : "Create"}</Button>
            </DialogActions>
        </form>
    </Dialog>;
};

export default CreateEditSurveyDialog;


