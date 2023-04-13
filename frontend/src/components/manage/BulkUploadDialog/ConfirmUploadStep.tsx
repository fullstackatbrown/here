import { Stack, TextField, Typography } from "@mui/material";
import { SinglePermissionRequest } from "model/course";
import { FC } from "react";
import ConfirmUploadListItem from "./ConfirmUploadListItem";
import { capitalizeFirstLetter } from "@util/shared/string";

interface ConfirmUploadStepProps {
    term: string;
    courses: Record<string, string>;
    permissionsByCourse: Record<string, SinglePermissionRequest[]>;
}


const ConfirmUploadStep: FC<ConfirmUploadStepProps> = ({ term, courses, permissionsByCourse }) => {

    return <Stack my={1}>
        <Typography ml={1} mb={1} fontWeight={500}>Creating {Object.keys(permissionsByCourse).length} courses for {capitalizeFirstLetter(term)}</Typography>
        {Object.entries(permissionsByCourse).map(([courseCode, permissions]) =>
            <ConfirmUploadListItem courseCode={courseCode} courseTitle={courses[courseCode]} permissions={permissionsByCourse[courseCode]} />
        )}
    </Stack>
}

export default ConfirmUploadStep;