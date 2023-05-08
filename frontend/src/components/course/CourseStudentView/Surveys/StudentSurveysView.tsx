import { Stack, Typography } from "@mui/material";
import { Course } from "model/course";
import { Survey } from "model/survey";
import { User } from "model/user";
import { FC, useMemo } from "react";
import StudentViewHeader from "../StudentViewHeader";
import StudentSurveyCard from "./StudentSurveyCard";

export interface StudentSurveysViewProps {
    course: Course;
    surveys: Survey[];
    student: User;
}

const StudentSurveysView: FC<StudentSurveysViewProps> = ({ course, surveys, student }) => {
    const surveySorted = useMemo(() => {
        return surveys?.filter(survey => survey.published).filter(s => s.published).sort((a, b) => {
            return new Date(a.endTime).getTime() - new Date(b.endTime).getTime()
        }) || []
    }, [surveys])

    return (
        <>
            <StudentViewHeader view="surveys" />
            <Stack direction="column" minHeight={60}>
                {surveys?.length === 0 &&
                    <Typography variant="body1" mt={1}>The instructor has not published any survey</Typography>
                }
                {surveySorted
                    .map((survey, index) =>
                        <StudentSurveyCard
                            key={survey.ID} {...{ survey, student }}
                            index={index}
                        />
                    )}
            </Stack>
        </>
    );
};

export default StudentSurveysView;