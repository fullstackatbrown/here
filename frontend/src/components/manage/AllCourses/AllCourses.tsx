import ManageCoursesDialog from "@components/settings/ManageCoursesDialog/ManageCoursesDialog";
import { Box, Typography } from "@mui/material";
import { getTerms } from "@util/shared/terms";
import { useCoursesByTerm } from "api/course/hooks";
import { FC, useState } from "react";
import TermListItem from "./TermListItem";

export interface AllCoursesProps {
}

const AllCourses: FC<AllCoursesProps> = ({ }) => {
    const [selectedTerm, setSelectedTerm] = useState<string | undefined>(undefined); // term
    const [courses, loading] = useCoursesByTerm();

    return !loading && <>
        {courses &&
            <ManageCoursesDialog
                term={selectedTerm}
                courses={courses[selectedTerm]}
                open={selectedTerm !== undefined}
                onClose={() => setSelectedTerm(undefined)}
            />
        }
        <Box>
            <Typography variant="h6" fontWeight={600} mb={1.5}>
                All Courses
            </Typography>
            {
                courses && getTerms(courses).map((term) => (
                    <TermListItem term={term} courses={courses[term]} />
                ))

            }
        </Box>
    </>;
};

export default AllCourses;


