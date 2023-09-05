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
    setError: UseFormSetError<SurveyFormData>;
    clearErrors: UseFormClearErrors<SurveyFormData>;
}

const SurveyStepOne: FC<SurveyStepOneProps> = ({ register, control, setError, clearErrors }) => {

    return <Stack spacing={2}>
        <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
                <TextField
                    value={value}
                    required
                    autoFocus
                    label="Survey Name"
                    type="text"
                    fullWidth
                    size="small"
                    variant="standard"
                    error={value.trim() === ""}
                    helperText={value.trim() === "" ? "Survey name cannot be empty" : ""}
                    onChange={(e) => {
                        onChange(e)
                        if (e.target.value.trim() === "") {
                            setError("name", {
                                type: "manual",
                                message: "Survey Name cannot be empty",
                            })
                        } else {
                            clearErrors("name")
                        }
                    }}

                />
            )}
        />
        <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
                <TextField
                    value={value}
                    multiline
                    required
                    autoFocus
                    label="Description"
                    type="text"
                    fullWidth
                    size="small"
                    variant="standard"
                    error={value.trim() === ""}
                    helperText={value.trim() === "" ? "Survey description cannot be empty" : ""}
                    onChange={(e) => {
                        onChange(e)
                        if (e.target.value.trim() === "") {
                            setError("description", {
                                type: "manual",
                                message: "Survey Description cannot be empty",
                            })
                        } else {
                            clearErrors("description")
                        }
                    }}

                />
            )}
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
                                    message: "Invalid End Date Value",
                                })
                                else clearErrors("enddate")
                            }}
                        />
                    )}
                />
            </LocalizationProvider>
        </Stack>
    </Stack>
}

export default SurveyStepOne