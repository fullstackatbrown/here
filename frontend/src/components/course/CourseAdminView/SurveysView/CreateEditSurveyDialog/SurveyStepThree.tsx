import { FC } from "react";
import { UseFormGetValues } from "react-hook-form";
import { SurveyDialogContent } from "../SurveyDialog";
import { SurveyFormData } from "./CreateEditSurveyDialog";
import { Survey } from "model/survey";

export interface SurveyStepThreeProps {
    getValues: UseFormGetValues<SurveyFormData>;
}

const SurveyStepThree: FC<SurveyStepThreeProps> = ({ getValues }) => {
    const survey = {
        ID: "",
        courseID: "",
        name: getValues("name"),
        description: getValues("description"),
        endTime: getValues("endDateParsed"),
        options: getValues("options"),
        responses: {},
        results: {},
        published: false
    } as Survey

    return <SurveyDialogContent survey={survey} />
}

export default SurveyStepThree