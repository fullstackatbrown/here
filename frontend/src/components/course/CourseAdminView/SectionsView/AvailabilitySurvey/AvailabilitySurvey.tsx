import { Box, Typography } from "@mui/material";
import { Course } from "model/general";

export interface AvailabilitySurveyProps {
    course: Course;
}

export default function AvailabilitySurvey(props: AvailabilitySurveyProps) {
    return (
        <>
            <Typography variant="h6" fontWeight={600}>
                Availability Survey
            </Typography>
            <Box height={100}>Fill this in...</Box>
        </>
    );
}
