import MyChip from "@components/shared/MyChip/MyChip";
import { Survey } from "model/survey";
import { FC } from "react";

export interface SurveyStatusChipProps {
    survey: Survey;
    style?: React.CSSProperties
    size?: "small" | "medium";
}

const SurveyStatusChip: FC<SurveyStatusChipProps> = ({ survey, style, size = "small" }) => {
    const endTime = new Date(survey.endTime)
        .toLocaleString("default", {
            month: "short",
            day: "2-digit",
        })

    const variant = "outlined"
    if (survey.published) {
        if (new Date(survey.endTime) > new Date()) {
            return <MyChip label={`published until ${endTime}`} color="primary" {...{ style, size, variant }} />;
        }
        return <MyChip label="ended" color="secondary" {...{ style, size, variant }} />;
    } else {
        return <MyChip label="draft" color="secondary" {...{ style, size, variant }} />;
    }
};

export default SurveyStatusChip;
