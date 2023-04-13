import { Stack, TextField } from "@mui/material";
import { FC } from "react";
import { useForm } from "react-hook-form";

export type AddStaffData = {
    data: string;
};

interface AddStaffStepProps {
    addStaffData: AddStaffData;
    setAddStaffData: (data: AddStaffData) => void;
}


const AddStaffStep: FC<AddStaffStepProps> = ({ addStaffData, setAddStaffData }) => {

    return <Stack spacing={2} my={1}>
        <TextField
            required
            autoFocus
            label="CSV Data"
            type="textarea"
            fullWidth
            multiline
            rows={11}
            size="small"
            variant="outlined"
            value={addStaffData.data}
            placeholder={`jenny_yu2@brown.edu,staff,cs1300\nhammad_izhar@brown.edu,admin,cs0200`}
            onChange={(e) => setAddStaffData({ data: e.target.value })}
        />
    </Stack>
}

export default AddStaffStep