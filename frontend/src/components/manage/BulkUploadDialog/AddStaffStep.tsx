import { Stack, TextField, Typography } from "@mui/material";
import { capitalizeWords } from "@util/shared/string";
import { FC } from "react";

interface AddStaffStepProps {
    term: string
    courses: Record<string, string>;
    addStaffData: string;
    setAddStaffData: (data: string) => void;
}


const AddStaffStep: FC<AddStaffStepProps> = ({ term, courses, addStaffData, setAddStaffData }) => {

    const formatCourseCodes = (courseCodes: string[]): string => {
        return courseCodes.length === 0 ? "None" : courseCodes.reduce((acc, curr) => {
            return acc + ", " + curr
        })
    }

    return <Stack spacing={2} my={1}>
        <Typography fontWeight={500}>{capitalizeWords(term)} Courses: {formatCourseCodes(Object.keys(courses))}</Typography>
        <Typography whiteSpace="pre" mb={2}>
            To add staff, paste comma-separated values with the following schema: (email,[staff/admin],course_code).{"\n"}
            If a person already has access, the request will be ignored.{"\n"}
        </Typography>
        <TextField
            required
            autoFocus
            label="Staff Data"
            type="textarea"
            fullWidth
            multiline
            rows={11}
            size="small"
            variant="outlined"
            value={addStaffData}
            placeholder={`jenny_yu2@brown.edu,staff,cs1300\nhammad_izhar@brown.edu,admin,cs0200`}
            onChange={(e) => setAddStaffData(e.target.value)}
        />
    </Stack>
}

export default AddStaffStep