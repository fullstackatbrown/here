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
    Stepper
} from "@mui/material";
import { handleBadRequestError } from "@util/errors";
import { getNextWeekDate } from "@util/shared/time";
import SurveyAPI from "api/surveys/api";
import { Section } from "model/section";
import { Survey } from "model/survey";
import { FC, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import SurveyStepOne from "./SurveyStepOne";
import SurveyStepThree from "./SurveyStepThree";
import SurveyStepTwo from "./SurveyStepTwo";
import { Option } from "model/survey"

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
    endDateParsed: string,
    options: Option[]
};

const CreateEditSurveyDialog: FC<CreateEditSurveyDialogProps> = ({ open, onClose, courseID, survey, sections }) => {
    const [activeStep, setActiveStep] = useState(0);
    const steps = ['Basic Information', 'Survey Fields', 'Preview'];

    const defaultValues = useMemo(() => ({
        name: survey ? survey.name : "Time Availability Survey",
        description: survey ? survey.description : "Please select all the times that you will be available.",
        enddate: survey ? new Date(survey.endTime) : getNextWeekDate(),
        endtime: survey ? new Date(survey.endTime) : getNextWeekDate(),
        endDateParsed: survey ? survey.endTime : getNextWeekDate().toISOString(),
        options: survey ? survey.options : [{ option: "", capacity: "" }]
    }), [survey])

    const { register, handleSubmit, control, reset, setValue, getValues, watch, formState: { } } = useForm<SurveyFormData>({
        defaultValues: defaultValues
    });

    const { fields, remove, insert, replace } = useFieldArray({
        name: "options",
        control,
        rules: {
            required: "Please add at least 1 option"
        }
    });

    const watchenddate = watch("enddate")
    const watchendtime = watch("endtime")

    useEffect(() => {
        if (watchenddate && watchendtime) {
            const endDate = new Date(watchenddate)
            const endTime = new Date(watchendtime)
            endDate.setHours(endTime.getHours(), endTime.getMinutes())
            setValue("endDateParsed", endDate.toISOString())
            console.log(endDate.toISOString())
        }
    }, [watchenddate, watchendtime])

    const handleNext = () => {
        if (activeStep === 0) {
            if (new Date(getValues("endDateParsed")) < new Date()) {
                toast.error("The time you selected is in the past.")
                return
            }
        } else if (activeStep === 1) {
            if (fields.length === 0 || fields.every(field => field.option === "" && field.capacity === "")) {
                toast.error("Please add at least 1 option.")
                return
            }
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => { setActiveStep((prevActiveStep) => prevActiveStep - 1); };

    useEffect(() => { reset(defaultValues) }, [defaultValues, reset]);

    const onSubmit = handleSubmit(async (data, event) => {
        console.log(data)
        if (survey) {
            toast.promise(SurveyAPI.updateSurvey(courseID, survey.ID, data.name, data.description, data.endDateParsed, data.options), {
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
            toast.promise(SurveyAPI.createSurvey(courseID, data.name, data.description, data.endDateParsed, data.options), {
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
        setActiveStep(0)
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
                            2: <SurveyStepThree {...{ getValues }} />,
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
                            0: <Button key="next" onClick={handleNext} variant="contained">Next</Button>,
                            1: <Button key="next" onClick={handleNext} variant="contained">Next</Button>,
                            2: <Button key="submit" type="submit" variant="contained">{survey ? "Update" : "Create"}</Button>,
                        }[activeStep]
                    }
                </Stack>
            </DialogActions>
        </form>
    </Dialog >;
};

export default CreateEditSurveyDialog;


