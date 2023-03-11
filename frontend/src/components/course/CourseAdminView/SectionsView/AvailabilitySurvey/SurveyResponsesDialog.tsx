import {
    Button, Dialog, DialogActions, DialogContent,
    DialogTitle,
    Typography
} from "@mui/material";
import formatSectionResponses from "@util/shared/formatSectionResponses";
import { Survey } from "model/survey";
import { FC, useEffect, useState } from "react";

export interface SurveyResponsesDialogProps {
    open: boolean;
    onClose: () => void;
    survey: Survey;
}


const SurveyResponsesDialog: FC<SurveyResponsesDialogProps> = ({ open, onClose, survey }) => {
    const numResponses = Object.keys(survey.responses).length
    const formattedResponses = formatSectionResponses(survey.responses)

    useEffect(() => {
        console.log(formatSectionResponses(survey.responses))
    }, []);

    return <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" keepMounted={false}>
        <DialogTitle>{survey.name} (Responses)</DialogTitle>
        <DialogContent>
            <Typography>
                {numResponses} have responded to this survey.
            </Typography>

            {Object.keys(formattedResponses).map((time) => {
                const percentage = (formattedResponses[time] / numResponses) * 100
                return <Typography>
                    {time}: {formattedResponses[time]} students, {percentage}%
                </Typography>
            }
            )}

        </DialogContent>
        <DialogActions>
            <Button type="submit" variant="contained">Allocate Sections</Button>
        </DialogActions>
    </Dialog>;
};

export default SurveyResponsesDialog;


