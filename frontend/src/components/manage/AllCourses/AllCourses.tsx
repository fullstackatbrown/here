import { Box, Typography } from "@mui/material";
import { getTerms } from "@util/shared/terms";
import { useCoursesByTerm } from "api/course/hooks";
import { FC, useState } from "react";
import TermListItem from "./TermListItem";

export interface AllCoursesProps {
}

const AllCourses: FC<AllCoursesProps> = ({ }) => {
    const [courses, loading] = useCoursesByTerm();

    return !loading && <Box>
        <Typography variant="h6" fontWeight={600} mb={1.5}>
            All Courses
        </Typography>
        {
            courses && getTerms(courses).map((term) => (
                <TermListItem term={term} courses={courses[term]} />
            ))

        }
    </Box>
};

export default AllCourses;


