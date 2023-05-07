import { Card, Dialog, DialogContent, DialogTitle, Grid } from "@mui/material";
import { formatDistance } from "date-fns";
import { Survey } from "model/survey";
import { User } from "model/user";
import { FC, useMemo } from "react";

interface AllSurveysDialogProps {
    open: boolean;
    onClose: () => void;
    surveys: Survey[];
    student: User;
}

const AllSurveysDialog: FC<AllSurveysDialogProps> = ({ open, onClose, surveys, student }) => {

    const surveyInformation = useMemo(() => {
        const surveysSorted = surveys.sort((a, b) => {
            return new Date(a.endTime).getTime() - new Date(b.endTime).getTime()
        })

        return surveysSorted.map(survey => {
            return {
                survey: survey,
                filledOut: surveys.some(s => s.ID === survey.ID && s.responses?.[student.ID] !== undefined),
                ended: surveys.some(s => s.ID === survey.ID && s.endTime && new Date(s.endTime) < new Date())
            }
        })
    }, [surveys])



    return <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>All Surveys</DialogTitle>
        <DialogContent>
            {surveyInformation.map((info) => (
                <Grid container spacing={2} key={info.survey.ID}>
                    <Grid item xs={12} sm={6} md={4} >
                        {info.survey.name}
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        {info.ended ? "Ended" : "Ending"} {formatDistance(new Date(info.survey.endTime), new Date(), { addSuffix: true })}
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        {info.filledOut ? "Filled out" : "Not filled out"}
                    </Grid>
                </Grid>

            ))}

        </DialogContent>
    </Dialog>


}

export default AllSurveysDialog
