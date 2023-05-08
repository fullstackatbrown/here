import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import DownloadIcon from '@mui/icons-material/Download';
import {
    Button, Dialog, DialogActions, DialogContent,
    DialogTitle,
    Grid,
    Typography
} from "@mui/material";
import { handleBadRequestError } from '@util/errors';
import { exportSurveyResponses, exportSurveyResults, exportSurveyResultsForSections } from '@util/shared/export';
import formatSurveyResponses from '@util/shared/survey';
import SurveyAPI from 'api/surveys/api';
import { Section } from 'model/section';
import { Survey, SurveyResponse } from "model/survey";
import { FC, useMemo } from "react";
import toast from 'react-hot-toast';
import AllocatedSectionsTable from './AllocatedSectionsTable';
import SurveyResponsesBarChart from './SurveyResponsesBarChart';
import SurveyResultsTable from './SurveyResultsTable';

export interface SurveyResponsesDialogProps {
    open: boolean;
    onClose: () => void;
    survey: Survey;
    numStudents: number;
    sectionsMap: Record<string, Section>;
}

const SurveyResponsesDialog: FC<SurveyResponsesDialogProps> = ({ open, onClose, survey, numStudents, sectionsMap }) => {
    const numResponses = useMemo(() =>
        survey.responses ? Object.keys(survey.responses).length : 0,
        [survey.responses])

    const formattedResponses = useMemo(() =>
        formatSurveyResponses(survey.options, survey.responses),
        [survey.responses, survey.options])

    const hasResults = useMemo(() =>
        survey.results ? Object.keys(survey.results).length > 0 : false,
        [survey.results])

    const handleRunAlgorithm = () => {
        toast.promise(SurveyAPI.generateResults(survey.courseID, survey.ID), {
            loading: "Running algorithm...",
            success: "Algorithm ran!",
            error: (err) => handleBadRequestError(err)
        })
            .catch(() => { })
    }

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
        survey.sectionCapacity ? exportSurveyResultsForSections(survey.results, sectionsMap) : exportSurveyResults(survey.results)
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
            <Grid container>
                <Grid item xs={12} md={9}>
                    <Typography fontSize={17} fontWeight={500}>
                        {survey.description}
                    </Typography>
                    <Typography mb={3}>
                        {numResponses} responses
                    </Typography>
                </Grid>
                <Grid item xs={12} md={3} display="flex" alignItems="center" justifyContent={{ xs: "flex-start", md: "flex-end" }}>
                    <Button variant="outlined" startIcon={<DownloadIcon />} disabled={numResponses === 0} onClick={handleExportResponses}>
                        Export Responses
                    </Button>
                </Grid>
            </Grid>

            <Grid container>
                <Grid item xs={0} md={2} />
                <Grid item xs={12} md={8} justifyContent="center" sx={{ minHeight: 240 }} mt={3} mb={5}>
                    <SurveyResponsesBarChart formattedResponses={formattedResponses} numResponses={numResponses} numStudents={numStudents} />
                </Grid>
                <Grid item xs={0} md={2} />
            </Grid>

            <Grid container>
                <Grid item xs={12} md={9}>
                    <Typography fontSize={17} fontWeight={500}>
                        Algorithm Results
                    </Typography>
                    <Typography mb={3}>
                        This will run an algorithm to automatically match students to options based on capacity and student availability.
                        Capacity may be overridden if there is no solution.
                    </Typography>
                </Grid>
                <Grid item xs={12} md={3} display="flex" alignItems="center" justifyContent={{ xs: "flex-start", md: "flex-end" }}>
                    <Button variant="outlined" startIcon={<DirectionsRunIcon />} disabled={numResponses === 0} onClick={handleRunAlgorithm}>
                        Run Algorithm
                    </Button>
                </Grid>
            </Grid>

            <Grid container>
                <Grid item xs={0} md={1.3} />
                <Grid item xs={12} md={9.4} display="flex" justifyContent="center">
                    {hasResults &&
                        (survey.sectionCapacity ?
                            <AllocatedSectionsTable sectionsMap={sectionsMap} results={survey.results} /> :
                            <SurveyResultsTable options={survey.options} results={survey.results} />
                        )
                    }
                </Grid>
                <Grid item xs={0} md={1.3} />
            </Grid>
        </DialogContent>
        <DialogActions sx={{ paddingTop: 2 }}>
            {hasResults && <Button variant="contained" onClick={handleExportResults}>Export Results</Button>}
            {hasResults && survey?.sectionCapacity && <Button variant="contained" onClick={handleApplyResults}>Apply Results</Button>}
        </DialogActions>
    </Dialog >
};

export default SurveyResponsesDialog;


