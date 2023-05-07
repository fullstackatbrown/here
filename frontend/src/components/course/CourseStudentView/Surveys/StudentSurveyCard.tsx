import SurveyDialog from "@components/course/CourseAdminView/SurveysView/SurveyDialog";
import MyChip from "@components/shared/MyChip/MyChip";
import { Grid, Theme, Typography, useMediaQuery, useTheme } from "@mui/material";
import { formatDistance } from "date-fns";
import { Survey } from "model/survey";
import { User } from "model/user";
import { FC, useMemo, useState } from "react";

export interface StudentSurveyCardProps {
    survey: Survey;
    student: User;
    index: number;
}

const StudentSurveyCard: FC<StudentSurveyCardProps> = ({ survey, student, index }) => {

    const filledOut = useMemo(() => survey.responses?.[student.ID] !== undefined, [survey, student]);
    const ended = useMemo(() => survey.endTime && new Date(survey.endTime) < new Date(), [survey]);

    const [hover, setHover] = useState(false);
    const [surveyDialogOpen, setSurveyDialogOpen] = useState(false);
    const isXsScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const theme = useTheme();

    return (
        <>
            <SurveyDialog
                open={surveyDialogOpen}
                survey={survey}
                onClose={() => { setSurveyDialogOpen(false) }}
                studentID={student.ID}
                disabled={ended}
            />
            <Grid container
                sx={{
                    "&:hover": { backgroundColor: theme.palette.action.hover },
                    borderTop: index === 0 ? "1px solid rgba(0, 0, 0, 0.12)" : "none",
                    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",

                }}
                mx={-0.8}
                pr={1.5}
                py={1.5}
                width="100%"
                display="flex" flexDirection="row" alignItems="center"
                onClick={() => setSurveyDialogOpen(true)}
                onMouseEnter={() => !isXsScreen && setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                <Grid item xs={8} md={3.5} display="flex" flexDirection="row" alignItems="center">
                    <Typography sx={{ fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", ml: 1 }}>
                        {survey.name}
                    </Typography>
                </Grid>

                <Grid item md={6.5} display={{ xs: "none", md: "flex" }} alignItems="center">
                    <Typography color="secondary" sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: 14 }}>
                        {survey.description}
                    </Typography>
                </Grid>

                <Grid item xs={4} md={2} display="flex" justifyContent="flex-end" alignItems="center">
                    {hover ?
                        <Typography fontSize={12} color="inherit" variant="button">
                            click to {ended ? "view" : (filledOut ? "update" : "fill")}
                        </Typography> :
                        (filledOut ?
                            <MyChip label="submitted" variant="outlined" color="success" />
                            : (ended ?
                                <MyChip label="Ended" variant="outlined" color="secondary" /> :
                                <MyChip label={`ending ${formatDistance(new Date(survey.endTime), new Date(), { addSuffix: true })}`} variant="outlined" color="primary" />
                            )
                        )
                    }
                </Grid>
            </Grid>

        </>
    );
};

export default StudentSurveyCard;
