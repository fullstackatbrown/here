import { useDialog } from "@components/shared/ConfirmDialog/ConfirmDialogProvider";
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import DoDisturbOnOutlinedIcon from '@mui/icons-material/DoDisturbOnOutlined';
import { Button, IconButton, Stack, Tooltip } from "@mui/material";
import { handleBadRequestError } from "@util/errors";
import CourseAPI from "api/course/api";
import { Course, CourseStatus } from "model/course";
import React, { FC, useState } from "react";
import toast from "react-hot-toast";
import ActivateCourseDialog from "../ActivateCourseDialog/ActivateCourseDialog";

export interface CourseActionsProps {
    course: Course;
}

const CourseActions: FC<CourseActionsProps> = ({ course }) => {
    const [activateCourseDialogOpen, setActivateCourseDialogOpen] = useState(false);
    const showDialog = useDialog();

    const handleChangeCourseStatus = (status: CourseStatus) => {
        return async (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();

            if (course.students && Object.keys(course.students).length > 0 && course.status === CourseStatus.CourseInactive) {
                alert("Cannot deactivate a course when students have enrolled. Consider archiving it to prevent future changes.")
                return;
            }

            let title = "";
            let message = "";
            switch (status) {
                case CourseStatus.CourseInactive:
                    title = `Deactivate ${course.code}?`
                    message = `All past data will be kept, but students will not be able to see or join the course.`;
                    break;
                case CourseStatus.CourseArchived:
                    title = `Archive ${course.code}?`
                    message = `Students and TAs can still see the course but cannot make any modifications.`;
                    break;
                case CourseStatus.CourseActive:
                    title = `Re-activate ${course.code}?`
                    message = `Students will be able to access the course.`;
                    break;
            }
            const confirmed = await showDialog({
                title: title,
                message: message,
            });
            if (confirmed) {
                toast.promise(CourseAPI.updateCourse(course.ID, undefined, undefined, status), {
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
            <Stack>
                {course.status === CourseStatus.CourseInactive &&
                    <Button onClick={() => { setActivateCourseDialogOpen(true) }}>
                        Activate
                    </Button>
                }
                {course.status === CourseStatus.CourseActive &&
                    <Stack direction="row" spacing={0.5}>
                        <Tooltip title="Deactivate">
                            <IconButton size="small"
                                onClick={handleChangeCourseStatus(CourseStatus.CourseInactive)}
                            >
                                <DoDisturbOnOutlinedIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Archive">
                            <IconButton size="small"
                                onClick={handleChangeCourseStatus(CourseStatus.CourseArchived)}
                            >
                                <ArchiveOutlinedIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                }
                {course.status === CourseStatus.CourseArchived &&
                    <Button onClick={handleChangeCourseStatus(CourseStatus.CourseActive)} >
                        Reactivate
                    </Button>
                }
            </Stack>
        </>
    );
};

export default CourseActions;


