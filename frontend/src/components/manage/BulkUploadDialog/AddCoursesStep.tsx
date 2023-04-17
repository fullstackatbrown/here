import { Stack, TextField } from "@mui/material";
import { FC } from "react";
import { useForm } from "react-hook-form";

export type AddCoursesData = {
    term: string;
    data: string;
};

interface AddCoursesStepProps {
    addCoursesData: AddCoursesData;
    setAddCoursesData: (data: AddCoursesData) => void;
}


const AddCoursesStep: FC<AddCoursesStepProps> = ({ addCoursesData, setAddCoursesData }) => {

    return <Stack spacing={2} my={1}>
        <TextField
            required
            label="Term"
            type="text"
            fullWidth
            size="small"
            variant="outlined"
            value={addCoursesData.term}
            onChange={(e) => setAddCoursesData({ ...addCoursesData, term: e.target.value })}
        />
        <TextField
            required
            autoFocus
            label="CSV Data"
            type="textarea"
            fullWidth
            multiline
            rows={10}
            size="small"
            variant="outlined"
            value={addCoursesData.data}
            placeholder={`cs1300,User Interface and User Experience\ncs0200,Program Design with Data Structures and Algorithms`}
            onChange={(e) => setAddCoursesData({ ...addCoursesData, data: e.target.value })}
        />
    </Stack>
}

export default AddCoursesStep