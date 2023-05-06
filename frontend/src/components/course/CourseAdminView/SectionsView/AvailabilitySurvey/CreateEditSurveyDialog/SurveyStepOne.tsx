import { FC } from "react";
import { Control, Controller, UseFormRegister } from "react-hook-form";
import { SurveyFormData } from "./CreateEditSurveyDialog";
import { Stack, TextField } from "@mui/material";
import { LocalizationProvider, DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export interface SurveyStepOneProps {
    register: UseFormRegister<SurveyFormData>;
    control: Control<SurveyFormData, any>;
}

const SurveyStepOne: FC<SurveyStepOneProps> = ({ register, control }) => {
    return <Stack spacing={2}>
        <TextField
            {...register("name")}
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
}

export default SurveyStepOne