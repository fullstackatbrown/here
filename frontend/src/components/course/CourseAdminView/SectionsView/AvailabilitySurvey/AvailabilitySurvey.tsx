import { Box, Button, Card, Stack, Typography } from "@mui/material";
import { Course } from "model/general";
import { Survey } from "model/survey";
import { useEffect, useState } from "react";
import CreateSurveyDialog from "./CreateSurveyDialog";

export interface AvailabilitySurveyProps {
    course: Course;
}

const exampleSurvey: Survey = {
    id: "tempid",
    courseID: "tempcourseid",
    name: "Time Availability Survey",
    capacity: new Map(),
    responses: new Map(),
    numResponses: 0,
}

export default function AvailabilitySurvey(props: AvailabilitySurveyProps) {
    const [createSurveyDialog, setcreateSurveyDialog] = useState(false);
    const [survey, setSurvey] = useState<Survey | null>(null);
    const [surveyPreviewDialog, setSurveyPreviewDialog] = useState(false);

    useEffect(() => {
        // TODO: get surveyid from backend

        // Uncomment this for testing UI
        // setSurvey(exampleSurvey);
    }, [])

    return (
        <>
            <CreateSurveyDialog open={createSurveyDialog} onClose={() => setcreateSurveyDialog(false)} />
            <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6" fontWeight={600}>
                    Availability Survey
                </Typography>
                {survey ?
                    // TODO: 
                    <Button onClick={() => { }}>
                        Update Survey
                    </Button> :
                    <Button onClick={() => setcreateSurveyDialog(true)}>
                        + Create Survey
                    </Button>}
            </Stack>
            <Box height={100}>
                Fill this in ...

            </Box>
        </>
    );
}
