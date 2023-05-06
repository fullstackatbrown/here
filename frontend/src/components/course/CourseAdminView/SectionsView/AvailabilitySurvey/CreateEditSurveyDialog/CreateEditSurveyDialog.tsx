import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    Step,
    StepLabel,
    Stepper,
    TextField, Typography
} from "@mui/material";
import { DatePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { handleBadRequestError } from "@util/errors";
import { KVPair, mapToList } from "@util/shared/survey";
import { getNextWeekDate } from "@util/shared/time";
import SurveyAPI from "api/surveys/api";
import { Survey } from "model/survey";
import { FC, useEffect, useMemo, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import SurveyStepOne from "./SurveyStepOne";
import SurveyStepTwo from "./SurveyStepTwo";
import { Section } from "model/section";

export interface CreateEditSurveyDialogProps {
    open: boolean;
    onClose: () => void;
    courseID: string;
    survey?: Survey;
    sections: Section[];
}

export type SurveyFormData = {
    name: string,
    description: string,
    enddate: Date,
    endtime: Date,
    options: KVPair[]
};

const CreateEditSurveyDialog: FC<CreateEditSurveyDialogProps> = ({ open, onClose, courseID, survey, sections }) => {
    const [activeStep, setActiveStep] = useState(0);
    const steps = ['Basic Information', 'Survey Fields', 'Preview'];

    const defaultValues = useMemo(() => ({
        name: survey ? survey.name : "Time Availability Survey",
        description: survey ? survey.description : "Please select all the times that you will be available.",
        enddate: survey ? new Date(survey.endTime) : getNextWeekDate(),
        endtime: survey ? new Date(survey.endTime) : getNextWeekDate(),
        options: survey ? mapToList(survey.options) : [{ key: "", value: "" }]
    }), [survey])

    const { register, handleSubmit, control, reset, setValue, formState: { } } = useForm<SurveyFormData>({
        defaultValues: defaultValues
    });

    const { fields, remove, insert, replace } = useFieldArray({
        name: "options",
        control,
        rules: {
            required: "Please add at least 1 option"
        }
    });

    const handleNext = () => { setActiveStep((prevActiveStep) => prevActiveStep + 1); };

    const handleBack = () => { setActiveStep((prevActiveStep) => prevActiveStep - 1); };

    useEffect(() => { reset(defaultValues) }, [defaultValues, reset]);

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
                error: (err) => {
                    if (err.code === "ERR_BAD_REQUEST") {
                        return err.response.data
                    } else {
                        return (err) => handleBadRequestError(err)
                    }
                }
            })
                .then(() => handleOnClose())
                .catch(() => { })
        } else {
            toast.promise(SurveyAPI.createSurvey(courseID, data.name, data.description, endDate.toISOString()), {
                loading: "Creating survey...",
                success: "Survey created!",
                error: (err) => {
                    if (err.code === "ERR_BAD_REQUEST") {
                        return err.response.data
                    } else {
                        return (err) => handleBadRequestError(err)
                    }
                }
            })
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
            <DialogTitle>
                {survey ? "Update" : "Create"} Survey
            </DialogTitle>
            <DialogContent>
                {survey && survey.published &&
                    <Alert severity="warning" sx={{ marginBottom: 2.5 }} style={{ display: 'flex', alignItems: 'center' }} >
                        This survey has already been published. Previous student responses will be kept and might not match the new section times.
                    </Alert>
                }
                <Stepper activeStep={activeStep}>
                    {steps.map((label, index) => {
                        const stepProps: { completed?: boolean } = {};
                        const labelProps: {
                            optional?: React.ReactNode;
                        } = {};
                        return (
                            <Step key={label} {...stepProps}>
                                <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
                <Box mx={1} mt={3}>
                    {
                        {
                            0: <SurveyStepOne {...{ register, control }} />,
                            1: <SurveyStepTwo {...{ register, fields, remove, setValue, insert, replace, sections }} />,
                            2: <SurveyStepOne {...{ register, control }} />,
                        }[activeStep]
                    }
                </Box>

            </DialogContent>
            <DialogActions sx={{ justifyContent: "space-between", mx: 1 }}>
                <Button onClick={handleOnClose}>Cancel</Button>
                <Stack direction="row" spacing={2}>
                    {!(activeStep === 0) && <Button onClick={handleBack} sx={{ mr: 1 }}>Back</Button>}
                    {
                        {
                            0: <Button onClick={handleNext} variant="contained">Next</Button>,
                            1: <Button onClick={handleNext} variant="contained">Next</Button>,
                            2: <Button type="submit" variant="contained">{survey ? "Update" : "Create"}</Button>,
                        }[activeStep]
                    }
                </Stack>
            </DialogActions>
        </form>
    </Dialog >;
};

export default CreateEditSurveyDialog;


