import React, { FC, useState } from "react";
import EditCourseDialog from "@components/settings/EditCourseDialog";
import { Box, Button, Divider, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import IconButton from "@components/shared/IconButton";
import ConfirmButton from "@components/shared/ConfirmButton";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import CourseAPI from "api/course/api";
import { Course, CourseStatus } from "model/course";
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import ActivateCourseDialog from "../ActivateCourseDialog/ActivateCourseDialog";
import { handleBadRequestError } from "@util/errors";
import toast from "react-hot-toast";

export interface CourseListItemProps {
    course: Course;
    isLastChild?: boolean;
}

const CourseListItem: FC<CourseListItemProps> = ({ course, isLastChild }) => {
    // const [openConfirm, setOpenConfirm] = useState(false);
    const [activateCourseDialogOpen, setActivateCourseDialogOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const handleCloseEdit = () => setOpenEdit(false);

    const handleChangeCourseStatus = (status: CourseStatus) => {
        return (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();

            if (course.students && Object.keys(course.students).length > 0 && course.status === CourseStatus.CourseInactive) {
                alert("Cannot deactivate a course when students have enrolled. Consider archiving it to prevent future changes.")
                return;
            }

            let confirmString = "";
            switch (status) {
                case CourseStatus.CourseInactive:
                    confirmString = `Are you sure you want to deactivate ${course.title}? All past data will be kept, but students will not be able to see or join the course.`;
                    break;
                case CourseStatus.CourseArchived:
                    confirmString = `Are you sure you want to archive ${course.title} on Here? Students and TAs can still see the course but cannot make any modifications.`;
                    break;
                case CourseStatus.CourseActive:
                    confirmString = `Are you sure you want to re-activate ${course.title}? Students will be able to access the course.`;
                    break;
            }
            const confirmed = confirm(confirmString);
            if (confirmed) {
                toast.promise(CourseAPI.updateCourse(course.ID, course.title, course.code, course.term, course.autoApproveRequests, status), {
                    loading: "Updating course status...",
                    success: "Course status updated!",
                    error: (err) => handleBadRequestError(err)
                })
                    .catch(() => { })
            }
        }
    }

    return (
        <>
            <ActivateCourseDialog course={course} open={activateCourseDialogOpen} onClose={() => { setActivateCourseDialogOpen(false) }} />
            <EditCourseDialog course={course} open={openEdit} onClose={handleCloseEdit} />
            <Stack direction="row" display="flex" justifyContent="space-between">
                <Stack>
                    <Typography>{course.code}: {course.title}</Typography>
                    <Typography color="secondary" fontSize={14}>{course.term}</Typography>
                </Stack>
                <Stack>
                    {course.status === CourseStatus.CourseInactive &&
                        <Button onClick={() => { setActivateCourseDialogOpen(true) }}>
                            Activate
                        </Button>
                    }
                    {course.status === CourseStatus.CourseActive &&
                        <Stack direction="row" spacing={0.5}>
                            <IconButton label="Edit" size="small"
                                onClick={() => setOpenEdit(true)}>
                                <EditIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                            <IconButton label="Deactivate" size="small"
                                onClick={handleChangeCourseStatus(CourseStatus.CourseInactive)}>
                                <CloseIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                            <IconButton label="Archive" size="small"
                                onClick={handleChangeCourseStatus(CourseStatus.CourseArchived)} >
                                <ArchiveOutlinedIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                        </Stack>
                    }
                    {course.status === CourseStatus.CourseArchived &&
                        <Button onClick={handleChangeCourseStatus(CourseStatus.CourseActive)} >
                            Reactivate
                        </Button>
                    }
                </Stack>
            </Stack>
            {!isLastChild && <Divider />}
        </>

    );
};

export default CourseListItem;


