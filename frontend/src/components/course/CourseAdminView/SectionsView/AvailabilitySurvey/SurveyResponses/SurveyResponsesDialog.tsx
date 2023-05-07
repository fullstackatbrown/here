import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import DownloadIcon from '@mui/icons-material/Download';
import {
    Box,
    Button, Dialog, DialogActions, DialogContent,
    DialogTitle,
    Stack, Typography
} from "@mui/material";
import { handleBadRequestError } from '@util/errors';
import { exportSurveyResponses, exportSurveyResults } from '@util/shared/export';
import formatSurveyResponses from '@util/shared/survey';
import SurveyAPI from 'api/surveys/api';
import { Section } from 'model/section';
import { Survey, SurveyResponse } from "model/survey";
import { FC, useMemo } from "react";
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
    const numResponses = useMemo(() =>
        survey.responses ? Object.keys(survey.responses).length : 0,
        [survey.responses])

    const formattedResponses = useMemo(() =>
        formatSurveyResponses(survey.options, survey.responses),
        [survey.responses, survey.options])

    const handleRunAlgorithm = () => {
        toast.promise(SurveyAPI.generateResults(survey.courseID, survey.ID), {
            loading: "Running algorithm...",
            success: "Algorithm ran!",
            error: (err) => handleBadRequestError(err)
        })
            .catch(() => { })
    }

    const hasResults = () => survey.results ? Object.keys(survey.results).length > 0 : false

    const handleApplyResults = () => {
        toast.promise(SurveyAPI.applyResults(survey.courseID, survey.ID), {
            loading: "Assigning students to sections",
            success: "Successfully assigned students to sections!",
            error: (err) => handleBadRequestError(err)
        })
            .then(() => { onClose() })
            .catch(() => { })
    }

    const handleExportResults = () => {
        exportSurveyResults(survey.results, sections)
    }

    const handleExportResponses = () => {
        SurveyAPI.getSurveyResponses(survey.courseID, survey.ID)
            .then((res) => {
                const responses = res as SurveyResponse[]
                exportSurveyResponses(responses)
            })
            .catch((err) => toast.error(handleBadRequestError(err)))
    }

    return <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" keepMounted={false}>
        <DialogTitle>{survey.name}</DialogTitle>

        <DialogContent >
            <Stack direction="row" alignItems="start" justifyContent="space-between" spacing={2} mb={2}>
                <Stack direction="column" maxWidth="70%">
                    <Typography fontSize={17} fontWeight={500}>
                        {survey.description}
                    </Typography>
                    <Typography mb={3}>
                        {numResponses} responses
                    </Typography>
                </Stack>
                <Button variant="outlined" startIcon={<DownloadIcon />} disabled={numResponses === 0} onClick={handleExportResponses}>
                    Export Responses
                </Button>
            </Stack>

            <Box mb={4} sx={{ minHeight: 300 }}>
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
                <Button variant="outlined" startIcon={<DirectionsRunIcon />} disabled={numResponses === 0} onClick={handleRunAlgorithm}>
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
        <DialogActions sx={{ paddingTop: 2 }}>
            {hasResults() && <Button variant="contained" onClick={handleExportResults}>Export Results</Button>}
            {hasResults() && <Button variant="contained" onClick={handleApplyResults}>Apply Results</Button>}
        </DialogActions>
    </Dialog >
};

export default SurveyResponsesDialog;


