import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { getTerms } from "@util/shared/terms";
import { useCoursesByTerm } from "api/course/hooks";
import { FC, useState } from "react";
import TermListItem from "./TermListItem";
import BulkUploadDialog from "../BulkUploadDialog/BulkUploadDialog";

export interface AllCoursesProps {
}

const AllCourses: FC<AllCoursesProps> = ({ }) => {
    const [bulkUploadDialogOpen, setBulkUploadDialogOpen] = useState(false);
    const [courses, loading] = useCoursesByTerm();

    return <>
        <BulkUploadDialog open={bulkUploadDialogOpen} onClose={() => setBulkUploadDialogOpen(false)} />
        <Box>
            <Stack display="flex" direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight={600} mb={1.5}>
                    Courses and Staff
                </Typography>
                <Button onClick={() => { setBulkUploadDialogOpen(true) }}>
                    Upload
                </Button>
            </Stack>
            {courses &&
                getTerms(courses).map((term) => (
                    <TermListItem term={term} courses={courses[term]} />
                ))
            }
        </Box>
    </>
};

export default AllCourses;


