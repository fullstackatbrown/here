import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { getTerms } from "@util/shared/terms";
import { useCoursesByTerm } from "api/course/hooks";
import { FC, useState } from "react";
import TermListItem from "./TermListItem";
import BulkUploadDialog from "../BulkUploadDialog/BulkUploadDialog";
import CreateEditCourseDialog from "../CreateEditCourseDialog/CreateEditCourseDialog";

export interface AllCoursesProps {
}

const AllCourses: FC<AllCoursesProps> = ({ }) => {
    const [addCourseDialogOpen, setAddCourseDialogOpen] = useState(false);
    const [bulkUploadDialogOpen, setBulkUploadDialogOpen] = useState(false);
    const [courses, loading] = useCoursesByTerm();

    return <>
        <CreateEditCourseDialog open={addCourseDialogOpen} onClose={() => setAddCourseDialogOpen(false)} />
        <BulkUploadDialog open={bulkUploadDialogOpen} onClose={() => setBulkUploadDialogOpen(false)} />
        <Box>
            <Stack display="flex" direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight={600} mb={1.5}>
                    Courses and Staff
                </Typography>
                <Stack display="flex" direction="row" alignItems="center">
                    <Button onClick={() => { setAddCourseDialogOpen(true) }}>
                        Add
                    </Button>
                    <Button onClick={() => { setBulkUploadDialogOpen(true) }}>
                        CSV Upload
                    </Button>
                </Stack>
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


