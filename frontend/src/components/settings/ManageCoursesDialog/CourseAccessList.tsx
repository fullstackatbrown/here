import { ExpandMore } from "@mui/icons-material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box, Collapse, Stack, Typography, useTheme } from "@mui/material";
import formatSectionInfo, { getSectionAvailableSeats } from "@util/shared/formatSectionInfo";
import { useCourseStaff } from "api/course/hooks";
import { Course } from "model/course";
import { CoursePermission } from "model/user";
import { FC, useEffect, useState } from "react";
import CourseAccessListItem from "./CourseAccessListItem";

interface CourseAccessListProps {
    course: Course;
}
const CourseAccessList: FC<CourseAccessListProps> = ({ course }) => {
    const [expanded, setExpanded] = useState(false);
    const [staff, staffLoading] = useCourseStaff(course.ID, CoursePermission.CourseStaff);
    const [admin, adminLoading] = useCourseStaff(course.ID, CoursePermission.CourseAdmin);
    const theme = useTheme();

    useEffect(() => {
        if (!staffLoading && !adminLoading) {
            setExpanded(true);
        }
    }, [staffLoading, adminLoading])

    return (
        <>
            <Box
                sx={{ "&:hover": { backgroundColor: theme.palette.action.hover } }}
                px={1}
                py={0.5}
                onClick={() => setExpanded(!expanded)}
            >
                <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={4} alignItems="center" py={0.5}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Box width={17} display="flex" alignItems="center">
                                {expanded ?
                                    <ExpandMore sx={{ fontSize: 16 }} /> :
                                    <KeyboardArrowRightIcon
                                        sx={{ fontSize: 16, color: "text.disabled" }}
                                    />
                                }
                            </Box>
                            <Typography>{course.code}: {course.title}</Typography>
                        </Stack>
                    </Stack>
                </Stack >
            </Box >
            <Collapse in={expanded}>
                {admin && staff &&
                    <Stack ml={4} mt={1} mb={2} spacing={1}>
                        <CourseAccessListItem course={course} access={CoursePermission.CourseAdmin} users={admin} />
                        <CourseAccessListItem course={course} access={CoursePermission.CourseStaff} users={staff} />
                    </Stack>}
            </Collapse>
        </>
    )
}

export default CourseAccessList