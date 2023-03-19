import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import {
    Box,
    Button, Dialog, DialogActions, DialogContent,
    DialogTitle, Stack, Typography
} from "@mui/material";
import errors from '@util/errors';
import formatSectionResponses, { TimeCount } from "@util/shared/formatSectionResponses";
import SurveyAPI from '@util/surveys/api';
import { Section } from 'model/section';
import { GenerateResultsResponse, Survey } from "model/survey";
import { FC, useEffect, useState } from "react";
import toast from 'react-hot-toast';
import AllocatedSectionsTable from './AllocatedSectionsTable';
import SurveyResponsesBarChart from './SurveyResponsesBarChart';

export interface SurveyResponsesDialogProps {
    open: boolean;
    onClose: () => void;
    survey: Survey;
    numStudents: number;
    sections: Section[];
}

const SurveyResponsesDialog: FC<SurveyResponsesDialogProps> = ({ open, onClose, survey, numStudents, sections }) => {
    const [formattedResponses, setFormattedResponses] = useState<TimeCount[]>([])
    const [numResponses, setNumResponses] = useState(0)

    useEffect(() => {
        setNumResponses(Object.keys(survey.responses).length)
        setFormattedResponses(formatSectionResponses(survey.capacity, survey.responses))
    }, [survey.responses])


    const handleRunAlgorithm = () => {
        toast.promise(SurveyAPI.generateResults(survey.courseID, survey.ID), {
            loading: "Running algorithm...",
            success: "Algorithm ran!",
            error: errors.UNKNOWN
        })
    }

    const hasResponses = () => {
        return survey.responses ? Object.keys(survey.responses).length > 0 : false
    }

    const hasResults = () => {
        return survey.results ? Object.keys(survey.results).length > 0 : false
    }

    const handleConfirmResults = () => {
        // TODO:
    }

    return <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" keepMounted={false}>
        <DialogTitle>{survey.name}</DialogTitle>

        <DialogContent >

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
                <Button variant="outlined" startIcon={<DirectionsRunIcon />} disabled={!hasResponses()} onClick={handleRunAlgorithm}>
                    Run Algorithm
                </Button>
            </Stack>

            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Box sx={{ width: '70%', }}>
                    {hasResults() && <AllocatedSectionsTable results={survey.results} sections={sections} />}
                </Box>
            </Box>

        </DialogContent>
        <DialogActions>
            {hasResults() && <Button variant="contained" onClick={handleConfirmResults}>Confirm Results</Button>}
        </DialogActions>




    </Dialog >
};

export default SurveyResponsesDialog;


