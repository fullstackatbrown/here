import { Box, Stack, TextField, Typography } from "@mui/material";
import { AddPermissionRequest } from "model/course";
import { FC } from "react";
import ConfirmUploadListItem from "./ConfirmUploadListItem";
import { capitalizeWords } from "@util/shared/string";

interface ConfirmUploadStepProps {
    term: string;
    courses: Record<string, string>;
    permissionsByCourse: Record<string, AddPermissionRequest[]>;
    success: boolean;
}


const ConfirmUploadStep: FC<ConfirmUploadStepProps> = ({ term, courses, permissionsByCourse, success }) => {

    const displayString = `${Object.keys(permissionsByCourse).length} courses for ${capitalizeWords(term)}`

    return <Stack my={1}>
        {
            <Box ml={1} mb={1}>
                {success ?
                    <Typography fontWeight={500}>Successfully created {displayString}!</Typography> :
                    <Typography fontWeight={500}>Creating {displayString}</Typography>}
            </Box>
        }
        {Object.entries(permissionsByCourse).map(([courseCode, permissions]) =>
            <ConfirmUploadListItem key={courseCode} courseCode={courseCode} courseTitle={courses[courseCode]} permissions={permissions} />
        )}
    </Stack>
}

export default ConfirmUploadStep;