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
import { usePrevious } from "@util/hooks";
import { getUniqueSectionTimes } from "@util/shared/sortSectionTime";
import { getNextWeekDate } from '@util/shared/time';
import SurveyAPI from "api/surveys/api";
import { Section } from "model/section";
import { Survey, SurveyOption } from "model/survey";
import { FC, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import SurveyStepOne from "./SurveyStepOne";
import SurveyStepThree from "./SurveyStepThree";
import SurveyStepTwo from "./SurveyStepTwo";
import dayjs from 'dayjs';

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
    enddate: dayjs.Dayjs, // user input
    endDateParsed: string, // end date gets stored as an ISO string
    options: SurveyOption[],
    sectionCapacity?: Record<string, Record<string, number>>
};

const CreateEditSurveyDialog: FC<CreateEditSurveyDialogProps> = ({ open, onClose, courseID, survey, sections }) => {
    const steps = ['Basic Information', 'Survey Fields', 'Preview'];
    const [activeStep, setActiveStep] = useState(0);
    // if we have a survey, we look at whether if it uses section data by checking if sectionCapacity is defined
    const [useSectionData, setUseSectionData] = useState(survey ? survey.sectionCapacity !== undefined : true)

    const [options, capacity] = useMemo(() => getUniqueSectionTimes(sections), [sections])

    const defaultValues = useMemo(() => ({
        name: survey ? survey.name : "Section Availability Survey",
        description: survey ? survey.description : "Please select all the times that you will be available.",
        enddate: survey ? dayjs(survey.endTime) : getNextWeekDate(),
        endDateParsed: survey ? survey.endTime : getNextWeekDate().toISOString(),
        options: survey ? survey.options : options,
        sectionCapacity: survey ? survey.sectionCapacity : capacity
    }), [survey, options, capacity])

    const { register, handleSubmit, control, reset, setValue, getValues, setError, clearErrors,
        watch, formState: { errors } } = useForm<SurveyFormData>({
            defaultValues: defaultValues
        });

    const { fields, remove, insert } = useFieldArray({
        name: "options",
        control,
    });

    const watchenddate = watch("enddate")

    // control the entire field array, which means each onChange reflects on the fields object.
    const watchOptions = watch("options");
    const controlledOptions = fields.map((field, index) => {
        return {
            ...field,
            ...watchOptions[index]
        };
    });

    const prevUseSectionData: boolean = usePrevious<boolean>(useSectionData);

    const handleResyncSectionData = () => {
        setValue("options", options)
        setValue("sectionCapacity", capacity)
    }

    useEffect(() => {
        // if we changed the useSectionData state, we need to resync the section data
        if (prevUseSectionData !== undefined && prevUseSectionData !== useSectionData) {
            if (useSectionData) {
                setValue("options", options)
                setValue("sectionCapacity", capacity)
            } else {
                setValue("options", [{ option: "", capacity: NaN }])
                setValue("sectionCapacity", undefined)
            }
        }
    }, [useSectionData, sections, setValue, prevUseSectionData, options, capacity])

    const handleNext = () => {
        if (activeStep === 0) {
            if (Object.keys(errors).length !== 0) {
                let error = "Please fix the following errors: \n"
                for (const key in errors) {
                    error += "- "
                    error += errors[key].message
                    error += "\n"
                }
                toast.error(error, { style: { whiteSpace: "pre-line" } })
                return
            }
            setValue("endDateParsed", watchenddate.toISOString())
        } else if (activeStep === 1) {
            // Check if all fields are filled
            if (controlledOptions.some((field) => field.option === "" || Number.isNaN(field.capacity))) {
                toast.error("Please fill in all the fields.")
                return
            }
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    useEffect(() => { reset(defaultValues) }, [defaultValues, reset]);

    const onSubmit = handleSubmit(async (data, event) => {
        if (survey) {
            // Check if any field has changed
            if (JSON.stringify(survey.options) === JSON.stringify(data.options) &&
                JSON.stringify(survey.sectionCapacity) === JSON.stringify(data.sectionCapacity) &&
                survey.name === data.name &&
                survey.description === data.description &&
                survey.endTime === data.endDateParsed) {
                handleOnClose()
                toast.success("No changes!")
                return
            }
            toast.promise(SurveyAPI.updateSurvey(
                courseID, survey.ID, data.name,
                data.description, data.endDateParsed,
                data.options, data.sectionCapacity
            ), {
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
            toast.promise(SurveyAPI.createSurvey(
                courseID, data.name,
                data.description, data.endDateParsed,
                data.options, data.sectionCapacity), {
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
                .then(() => {
                    handleOnClose()
                })
                .catch(() => { })
        }
    });

    const handleOnClose = () => {
        onClose()
        reset()
        setActiveStep(0)
        setUseSectionData(true)
    }

    return <Dialog open={open} fullWidth maxWidth="sm" keepMounted={false}>
        <form onSubmit={onSubmit}>
            <DialogTitle>
                {survey ? "Update" : "Create"} Survey
            </DialogTitle>
            <DialogContent>
                {survey && survey.published &&
                    <Alert severity="warning" sx={{ marginBottom: 2.5 }} style={{ display: 'flex', alignItems: 'center' }} >
                        This survey has already been published. Previous student responses will be kept and might not match the new options.
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
                            0: <SurveyStepOne {...{ register, control, watch, setError, clearErrors }} />,
                            1: <SurveyStepTwo
                                options={controlledOptions}
                                {...{ survey, register, remove, setValue, insert, useSectionData, setUseSectionData, handleResyncSectionData }}
                            />,
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


