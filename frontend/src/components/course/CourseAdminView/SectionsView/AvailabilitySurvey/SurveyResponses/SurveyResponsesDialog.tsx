import {
    Box,
    Button, createTheme, Dialog, DialogActions, DialogContent,
    DialogTitle,
    Link,
    Stack, ThemeProvider, Typography
} from "@mui/material";
import { dummySectionsMap } from '@util/section/hooks';
import { formatSectionResponses, mapToList, TimeCount } from "@util/shared/formatSectionResponses";
import { Survey } from "model/survey";
import { FC, useEffect, useState } from "react";
import AllocatedSectionsTable from './AllocatedSectionsTable';
import SurveyResponsesBarChart from './SurveyResponsesBarChart';

export interface SurveyResponsesDialogProps {
    open: boolean;
    onClose: () => void;
    survey: Survey;
}

const SurveyResponsesDialog: FC<SurveyResponsesDialogProps> = ({ open, onClose, survey }) => {
    const [formattedResponses, setFormattedResponses] = useState<TimeCount[]>([])
    const [numResponses, setNumResponses] = useState(0)

    useEffect(() => {
        setNumResponses(Object.keys(survey.responses).length)
        const formattedRes = mapToList(formatSectionResponses(survey.responses))
        setFormattedResponses(formattedRes)
    }, [survey.responses])


    const handleAllocateSections = () => {
        // Submit API request to run algorithm
        // will receive the results and a list of sections from backend
    }

    const hasResults = () => {
        return survey.results ? Object.keys(survey.results).length > 0 : false
    }

    return <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" keepMounted={false}>
        <DialogTitle>{survey.name}</DialogTitle>

        <DialogContent >
            <>
                <Typography fontSize={17} fontWeight={500}>
                    {survey.description}
                </Typography>
                <Typography mb={3}>
                    {numResponses} responses
                </Typography>
                <Box mb={4} sx={{
                    // width: '80%',
                    minHeight: 300,
                }}
                >
                    <SurveyResponsesBarChart formattedResponses={formattedResponses} numResponses={numResponses} />
                </Box>

                <Typography fontSize={17} fontWeight={500}>
                    Allocate Sections
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                    <Link
                        component="button"
                        variant="body1"
                        onClick={() => {
                            console.info("I'm a button.");
                        }}
                    >
                        Run Algorithm
                    </Link>
                    <Typography mb={3}>
                        to automatically allocate sections based on student responses.
                    </Typography>
                </Stack>

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Box sx={{ width: '70%', }}>
                        {hasResults() && <AllocatedSectionsTable results={survey.results} sections={dummySectionsMap} />}
                    </Box>
                </Box>

            </>
        </DialogContent>
        <DialogActions>
            {hasResults() && <Button variant="contained">Confirm</Button>}
        </DialogActions>




    </Dialog >
};

export default SurveyResponsesDialog;


