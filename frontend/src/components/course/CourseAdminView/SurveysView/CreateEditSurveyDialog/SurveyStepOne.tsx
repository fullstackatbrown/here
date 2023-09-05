import { FC } from "react";
import { Control, Controller, UseFormClearErrors, UseFormGetValues, UseFormRegister, UseFormSetError, UseFormWatch } from "react-hook-form";
import { SurveyFormData } from "./CreateEditSurveyDialog";
import { Stack, TextField } from "@mui/material";
import { LocalizationProvider, DatePicker, TimePicker } from "@mui/x-date-pickers";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export interface SurveyStepOneProps {
    register: UseFormRegister<SurveyFormData>;
    control: Control<SurveyFormData, any>;
    watch: UseFormWatch<SurveyFormData>;
    setError: UseFormSetError<SurveyFormData>;
    clearErrors: UseFormClearErrors<SurveyFormData>;
}

const SurveyStepOne: FC<SurveyStepOneProps> = ({ register, control, watch, setError, clearErrors }) => {
    const watchname = watch("name")

    return <Stack spacing={2}>
        <TextField
            {...register("name")}
            error={watchname.trim() === ""}
            required
            autoFocus
            label="Survey Name"
            type="text"
            fullWidth
            size="small"
            variant="standard"
            helperText={watchname.trim() === "" ? "Survey name cannot be empty" : ""}
            onChange={(e) => {
                if (e.target.value.trim() === "") {
                    setError("name", {
                        type: "manual",
                        message: "Survey Name cannot be empty",
                    })
                } else {
                    clearErrors()
                }
            }}
        />
        <TextField
            {...register("description")}
            multiline
            required
            label="Description"
            type="text"
            fullWidth
            size="small"
            variant="standard"
        />
        <Stack direction="row" spacing={3} pt={1} pb={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                    control={control}
                    name="enddate"
                    render={({ field: { onChange, value } }) => (
                        <DateTimePicker
                            label="End Date"
                            value={value}
                            onChange={onChange}
                            disablePast
                            views={['year', 'month', 'day', 'hours', 'minutes']}
                            onError={(e) => {
                                if (e) setError("enddate", {
                                    type: "manual",
                                    message: "Invalid End Date",
                                })
                                else clearErrors()
                            }}
                        />
                    )}
                />
            </LocalizationProvider>
        </Stack>
    </Stack>
}

export default SurveyStepOne