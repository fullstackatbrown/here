import React, { FC, useState } from "react";
import CreateCourseDialog from "@components/settings/CreateCourseDialog";
import { Box, List, ListItemButton, Stack, Typography } from "@mui/material";
import { useCourses, useCoursesByTerm } from "api/course/hooks";
import CourseListItem from "../CourseListItem";
import SettingsSection from "@components/settings/SettingsSection";
import BulkUploadDialog from "../BulkUploadDialog";
import { getTerms } from "@util/shared/terms";
import { CapitalizeFirstLetter } from "@util/shared/string";
import ManageCoursesDialog from "../ManageCoursesDialog/ManageCoursesDialog";

export interface AllCoursesSectionProps {
}

/**
 * Lists all courses.
 */
const AllCoursesSection: FC<AllCoursesSectionProps> = ({ }) => {
    const [selectedTerm, setSelectedTerm] = useState<string | undefined>(undefined); // term
    // const [openCreate, setOpenCreate] = useState(false);
    // const [openBulk, setOpenBulk] = useState(false);
    const [courses, loading] = useCoursesByTerm();

    if (loading) return <></>;

    // primaryActionButton={{ label: "New", onClick: () => setOpenCreate(true) }}
    // secondaryActionButton={{ label: "Bulk Upload", onClick: () => setOpenBulk(true) }}
    return <>
        {courses &&
            <ManageCoursesDialog
                term={selectedTerm}
                courses={courses[selectedTerm]}
                open={selectedTerm !== undefined}
                onClose={() => setSelectedTerm(undefined)}
            />
        }
        {/* <CreateCourseDialog open={openCreate} onClose={() => setOpenCreate(false)} />
        <BulkUploadDialog open={openBulk} onClose={() => setOpenBulk(false)} /> */}
        <SettingsSection adminOnly title="Manage all courses">
            {
                courses && getTerms(courses).map((term, index) => (
                    <ListItemButton
                        disableRipple
                        onClick={() => setSelectedTerm(term)}
                        sx={{ paddingLeft: 0 }}
                    >
                        <Typography width={100}>
                            {CapitalizeFirstLetter(term)}
                        </Typography>
                        <Typography color="secondary" fontSize={14}>
                            {courses[term].length} course{courses[term].length > 1 ? "s" : ""}
                        </Typography>
                    </ListItemButton>
                    // <Box display="flex" flexDirection="row" alignItems="center" sx={{
                    //     '&:hover': {
                    //         backgroundColor: 'disabled.main',
                    //     },
                    // }}>
                    //     <Typography width={100}>
                    //         {term}
                    //     </Typography>
                    //     <Typography color="secondary" fontSize={14}>
                    //         {courses[term].length} course{courses[term].length > 1 ? "s" : ""}
                    //     </Typography>
                    // </Box>
                ))

            }

            {/* {courses && <List>
                {courses.length == 0 && <Typography textAlign="center">There are no courses.</Typography>}
                {courses.map((course, index) => <CourseListItem key={course.ID} course={course}
                    isLastChild={index === (courses.length - 1)} />)}
            </List>} */}
        </SettingsSection>
    </>;
};

export default AllCoursesSection;


