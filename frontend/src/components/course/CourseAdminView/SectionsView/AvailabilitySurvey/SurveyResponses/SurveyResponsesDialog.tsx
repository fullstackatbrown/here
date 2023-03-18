import {
    Box,
    Button, createTheme, Dialog, DialogActions, DialogContent,
    DialogTitle,
    IconButton,
    Link,
    Stack, ThemeProvider, Typography
} from "@mui/material";
import { dummySectionsMap } from '@util/section/hooks';
import { formatSectionResponses, mapToList, TimeCount } from "@util/shared/formatSectionResponses";
import { Survey } from "model/survey";
import { FC, useEffect, useState } from "react";
import AllocatedSectionsTable from './AllocatedSectionsTable';
import SurveyResponsesBarChart from './SurveyResponsesBarChart';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import toast from "react-hot-toast";
import SurveyAPI from "@util/surveys/api";
import Errors from "@util/errors";
import errors from "@util/errors";

export interface SurveyResponsesDialogProps {
    open: boolean;
    onClose: () => void;
    survey: Survey;
    numStudents: number;
}

const SurveyResponsesDialog: FC<SurveyResponsesDialogProps> = ({ open, onClose, survey, numStudents }) => {
    const [formattedResponses, setFormattedResponses] = useState<TimeCount[]>([])
    const [numResponses, setNumResponses] = useState(0)

    useEffect(() => {
        setNumResponses(Object.keys(survey.responses).length)
        const formattedRes = mapToList(formatSectionResponses(survey.capacity, survey.responses))
        setFormattedResponses(formattedRes)
    }, [survey.responses])


    const handleRunAlgorithm = () => {
        // toast.promise(SurveyAPI.generateResults(survey.courseID, survey.ID), {
        //     loading: "Running algorithm...",
        //     success: "Algorithm ran!",
        //     error: errors.UNKNOWN
        // });
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
                    minHeight: 300,
                }}
                >
                    <SurveyResponsesBarChart formattedResponses={formattedResponses} numResponses={numResponses} numStudents={numStudents} />
                </Box>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} mb={2}>
                    <Stack direction="column" maxWidth="70%">
                        <Typography fontSize={17} fontWeight={500}>
                            Allocate Sections
                        </Typography>
                        <Typography mb={3}>
                            This will run an algorithm to automatically allocate sections based on student availability and section capacity.
                            Capacity may be overridden if there is no solution.
                        </Typography>
                    </Stack>
                    <Button variant="outlined" startIcon={<DirectionsRunIcon />} disabled={!hasResults()} onClick={handleRunAlgorithm}>
                        Run Algorithm
                    </Button>
                </Stack>


                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} mb={2}>
                    {/* <Button>Run Algorithm</Button> */}
                    {/* <Link
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
                    </Typography> */}
                </Stack>
                {/* 
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Box sx={{ width: '70%', }}>
                        {hasResults() && <AllocatedSectionsTable results={survey.results} sections={dummySectionsMap} />}
                    </Box>
                </Box> */}

            </>
        </DialogContent>
        <DialogActions>
            {hasResults() && <Button variant="contained">Confirm</Button>}
        </DialogActions>




    </Dialog >
};

export default SurveyResponsesDialog;


