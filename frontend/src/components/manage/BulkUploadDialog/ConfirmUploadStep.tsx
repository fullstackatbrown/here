import { Box, Stack, TextField, Typography } from "@mui/material";
import { AddPermissionRequest } from "model/course";
import { FC } from "react";
import ConfirmUploadListItem from "./ConfirmUploadListItem";
import { capitalizeWords } from "@util/shared/string";

interface ConfirmUploadStepProps {
    term: string;
    courses: Record<string, string>;
    permissionsByCourse: Record<string, AddPermissionRequest[]>;
}


const ConfirmUploadStep: FC<ConfirmUploadStepProps> = ({ term, courses, permissionsByCourse }) => {

    const numCourses = Object.keys(permissionsByCourse).length;

    return <Stack my={1}>
        <Typography ml={1} mb={1} fontWeight={500}>
            Adding staff for {numCourses} course{numCourses > 1 && "s"} for {capitalizeWords(term)}
        </Typography>
        {Object.entries(permissionsByCourse).map(([courseCode, permissions]) =>
            <ConfirmUploadListItem key={courseCode} courseCode={courseCode} courseTitle={courses[courseCode]} permissions={permissions} />
        )}
    </Stack>
}

export default ConfirmUploadStep;