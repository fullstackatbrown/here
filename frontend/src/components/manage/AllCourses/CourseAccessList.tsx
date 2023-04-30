import { ExpandMore } from "@mui/icons-material";
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from "@mui/icons-material/Edit";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box, Collapse, IconButton, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import { useCourseStaff } from "api/course/hooks";
import { Course, CourseStatus } from "model/course";
import { CoursePermission } from "model/user";
import { FC, useState } from "react";
import CreateEditCourseDialog from "../CreateEditCourseDialog/CreateEditCourseDialog";
import AccessList from "../../shared/AccessList/AccessList";
import CourseStatusChip from "@components/shared/CourseStatusChip/CourseStatusChip";
import { handleBadRequestError } from "@util/errors";
import CourseAPI from "api/course/api";
import toast from "react-hot-toast";
import { useCourseInvites } from "api/auth/hooks";
import { useDialog } from "@components/shared/ConfirmDialog/ConfirmDialogProvider";

interface CourseAccessListProps {
    course: Course;
}
const CourseAccessList: FC<CourseAccessListProps> = ({ course }) => {
    const [expanded, setExpanded] = useState(false);
    const [hover, setHover] = useState(false);
    const [staff, staffLoading] = useCourseStaff(course.ID, CoursePermission.CourseStaff);
    const [admin, adminLoading] = useCourseStaff(course.ID, CoursePermission.CourseAdmin);
    const [adminInvites, adminInvitesLoading] = useCourseInvites(course.ID, CoursePermission.CourseAdmin);
    const [staffInvites, staffInvitesLoading] = useCourseInvites(course.ID, CoursePermission.CourseStaff);
    const [editCourseDialogOpen, setEditCourseDialogOpen] = useState<Course | undefined>(undefined);
    const theme = useTheme();
    const showDialog = useDialog();

    const handleOpenEditCourseDialog = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        setEditCourseDialogOpen(course);
    }

    // CourseStatusChip
    const handleDeleteCourse = async (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        let message = "Are you sure you want to delete this course?";
        if (course.students && Object.keys(course.students).length > 0) {
            message += " There are students registered for the course.";
        }
        message += " This action cannot be undone.";
        const confirmed = await showDialog({
            title: "Delete Course",
            message: message,
        })
        if (confirmed) {
            toast.promise(CourseAPI.deleteCourse(course.ID), {
                loading: "Deleting course...",
                success: "Course deleted successfully",
                error: (err) => handleBadRequestError(err),
            })
                .catch(() => { })
        }
    }

    return (
        <>
            <CreateEditCourseDialog
                open={editCourseDialogOpen !== undefined}
                onClose={() => setEditCourseDialogOpen(undefined)}
                course={editCourseDialogOpen}
            />
            <Box
                sx={{ "&:hover": { backgroundColor: theme.palette.action.hover } }}
                px={1}
                py={0.5}
                onClick={() => setExpanded(!expanded)}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
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
                            <CourseStatusChip status={course.status} />
                        </Stack>
                    </Stack>
                    {hover &&
                        <Stack direction="row" alignItems="center">
                            <Tooltip title="Edit Course Info">
                                <IconButton sx={{ p: 0.5 }} onClick={handleOpenEditCourseDialog}>
                                    <EditIcon sx={{ fontSize: 20 }} />
                                </IconButton>
                            </Tooltip>
                            {course.status === CourseStatus.CourseInactive &&
                                <Tooltip title="Delete Course">
                                    <IconButton sx={{ p: 0.5 }} onClick={handleDeleteCourse}>
                                        <CloseIcon sx={{ fontSize: 20 }} />
                                    </IconButton>
                                </Tooltip>
                            }
                        </Stack>
                    }

                </Stack >
            </Box >
            <Collapse in={expanded}>
                {admin && staff && adminInvites && staffInvites &&
                    <Stack ml={4} mt={1} mb={2} spacing={1}>
                        <AccessList course={course} access={CoursePermission.CourseAdmin} users={admin} emails={adminInvites} />
                        <AccessList course={course} access={CoursePermission.CourseStaff} users={staff} emails={staffInvites} />
                    </Stack>}
            </Collapse>
        </>
    )
}

export default CourseAccessList