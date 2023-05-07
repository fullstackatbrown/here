import { Button, Grid } from "@mui/material";
import { Course } from "model/course";
import { FC, useMemo } from "react";
import StudentViewHeader from "../StudentViewHeader";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AuthAPI from "api/auth/api";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { handleBadRequestError } from "@util/errors";
import { useDialog } from "@components/shared/ConfirmDialog/ConfirmDialogProvider";
import { Survey } from "model/survey";
import { User } from "model/user";
import { formatDistance } from "date-fns";

export interface SurveysViewProps {
    course: Course;
    surveys: Survey[];
    student: User;
}

const SurveysView: FC<SurveysViewProps> = ({ course, surveys, student }) => {
    const surveysVisible = useMemo(() => {
        return surveys.filter(survey => survey.published)
    }, [surveys])

    const surveyInformation = useMemo(() => {
        const surveysSorted = surveys.filter(s => s.published).sort((a, b) => {
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

    return (
        <>
            <StudentViewHeader view="surveys" />
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
        </>
    );
};

export default SurveysView;

// {surveysVisible.length > 0 &&
//     <Button variant={isXsScreen ? "outlined" : "text"} startIcon={<CalendarMonth />} onClick={() => { setAllSurveysDialog(true) }}>
//         {/* {studentHasFilledOutSurvey() ? "Update Survey Response" : "Fill Out Survey"} */}
//     </Button>
//   }