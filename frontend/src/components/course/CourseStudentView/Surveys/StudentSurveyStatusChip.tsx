import MyChip from "@components/shared/MyChip/MyChip";
import { formatDistance } from "date-fns";
import { Survey } from "model/survey";
import { User } from "model/user";
import { FC, useMemo } from "react";

export interface StudentSurveyStatusChipProps {
    survey: Survey;
    filledOut: boolean;
    style?: React.CSSProperties
    size?: "small" | "medium";
}

const StudentSurveyStatusChip: FC<StudentSurveyStatusChipProps> = ({ survey, filledOut, style, size = "small" }) => {
    const ended = useMemo(() => new Date(survey.endTime) < new Date(), [survey]);
    const variant = "outlined"
    if (filledOut) {
        return <MyChip label="submitted" color="success" {...{ style, size, variant }} />;
    } else if (ended) {
        return <MyChip label="ended" color="secondary" {...{ style, size, variant }} />;
    } else {
        return <MyChip label={`ending ${formatDistance(new Date(survey.endTime), new Date(), { addSuffix: true })}`} variant="outlined" color="primary" />;
    }
};

export default StudentSurveyStatusChip;
