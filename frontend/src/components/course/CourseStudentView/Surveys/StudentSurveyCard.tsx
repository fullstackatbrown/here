import SurveyDialog from "@components/course/CourseAdminView/SectionsView/Survey/SurveyDialog";
import MyChip from "@components/shared/MyChip/MyChip";
import { Grid, Theme, Typography, useMediaQuery, useTheme } from "@mui/material";
import { formatDistance } from "date-fns";
import { Course } from "model/course";
import { Survey } from "model/survey";
import { User } from "model/user";
import { FC, useMemo, useState } from "react";

export interface StudentSurveyCardProps {
    survey: Survey;
    course: Course;
    student: User;
}

const StudentSurveyCard: FC<StudentSurveyCardProps> = ({ survey, course, student }) => {

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
                sx={{ "&:hover": { backgroundColor: theme.palette.action.hover } }}
                mx={-0.8}
                pr={2}
                py={1.5}
                width="100%"
                display="flex" flexDirection="row" alignItems="center"
                onClick={() => setSurveyDialogOpen(true)}
                onMouseEnter={() => !isXsScreen && setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                <Grid item xs={8} md={3}>
                    <Typography sx={{ fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", ml: 1 }}>
                        {survey.name}
                    </Typography>
                </Grid>

                <Grid item md={7} display={{ xs: "none", md: "flex" }} alignItems="center">
                    <Typography color="secondary" sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: 14 }}>
                        {survey.description}
                    </Typography>
                </Grid>

                <Grid item xs={4} md={2} display="flex" justifyContent="flex-end" alignItems="center">
                    {hover ?
                        <Typography fontSize={12} color="inherit" variant="button">
                            {ended ? "View" : (filledOut ? "Update" : "Create")} Response
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
