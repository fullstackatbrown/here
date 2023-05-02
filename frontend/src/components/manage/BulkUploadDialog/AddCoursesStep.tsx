import { Stack, TextField, Typography } from "@mui/material";
import { capitalizeWords } from "@util/shared/string";
import { Course } from "model/course";
import { FC } from "react";

interface AddCoursesStepProps {
    term: string;
    courses: Course[];
    addCoursesData: string;
    setAddCoursesData: (data: string) => void;
}

const AddCoursesStep: FC<AddCoursesStepProps> = ({ term, courses, addCoursesData, setAddCoursesData }) => {

    return <Stack spacing={2} my={1}>
        <Typography fontWeight={500}>
            Existing {capitalizeWords(term)} Courses: {courses.length > 0 ? courses.map(course => course.code).join(", ") : "None"}
        </Typography>
        <Typography whiteSpace="pre" mb={2}>
            To add new courses, paste comma-separated values with the following schema: (course_code,course_name).
        </Typography>
        <TextField
            required
            autoFocus
            label="New Courses"
            type="textarea"
            fullWidth
            multiline
            rows={10}
            size="small"
            variant="outlined"
            value={addCoursesData}
            placeholder={`cs1300,User Interface and User Experience\ncs0200,Program Design with Data Structures and Algorithms`}
            onChange={(e) => setAddCoursesData(e.target.value)}
        />
    </Stack>
}

export default AddCoursesStep