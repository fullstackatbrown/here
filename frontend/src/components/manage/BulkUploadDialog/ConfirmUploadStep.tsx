import { Box, Stack, TextField, Typography } from "@mui/material";
import { AddPermissionRequest } from "model/course";
import { FC } from "react";
import ConfirmUploadListItem from "./ConfirmUploadListItem";
import { capitalizeWords } from "@util/shared/string";

interface ConfirmUploadStepProps {
    term: string;
    courses: Record<string, string>;
    permissionsByCourse: Record<string, AddPermissionRequest[]>;
    uploadErrors?: Record<string, string>;
}


const ConfirmUploadStep: FC<ConfirmUploadStepProps> = ({ term, courses, permissionsByCourse, uploadErrors }) => {

    const numCourses = Object.keys(permissionsByCourse).length;

    return <Stack my={1}>
        <Typography ml={1} mb={1} fontWeight={500}>
            Adding staff for {numCourses} course{numCourses > 1 && "s"} for {capitalizeWords(term)}
        </Typography>
        {Object.entries(permissionsByCourse).map(([courseCode, permissions]) =>
            <ConfirmUploadListItem key={courseCode} courseCode={courseCode} courseTitle={courses[courseCode]} permissions={permissions} />
        )}

        {uploadErrors && Object.entries(uploadErrors).map(([email, error]) =>
            <>
                <Typography ml={1} mt={2} mb={1} fontWeight={500} sx={{ color: "error.main" }}>
                    Error adding permission for {Object.keys(uploadErrors || {}).length} staff member{Object.keys(uploadErrors || {}).length > 1 && "s"}
                </Typography>
                <Typography ml={1} key={email} sx={{ fontSize: 14, color: "error.main" }}>{email}: {error}</Typography>
            </>
        )}

    </Stack>
}

export default ConfirmUploadStep;