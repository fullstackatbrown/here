import { useDialog } from "@components/shared/ConfirmDialog/ConfirmDialogProvider";
import { Alert, Button, Stack, Typography } from "@mui/material";
import { handleBadRequestError } from "@util/errors";
import CourseAPI from "api/course/api";
import { Course, CourseStatus } from "model/course";
import { CoursePermission } from "model/user";
import { FC } from "react";
import toast from "react-hot-toast";

export interface CourseHeaderProps {
  intersectionRef: (node?: Element) => void;
  course: Course;
  access: CoursePermission;
}

export const CourseHeader: FC<CourseHeaderProps> = ({ intersectionRef, course, access }) => {
  const showDialog = useDialog()
  const handleReactivateCourse = async () => {
    const confirmed = await showDialog({
      title: 'ReActivate Course',
      message: `Are you sure you want to reactivate ${course.title}? Students will be able to access the course.`,
    })
    if (confirmed) {
      toast.promise(CourseAPI.updateCourse(course.ID, undefined, undefined, CourseStatus.CourseActive), {
        loading: "Updating course status...",
        success: "Course status updated!",
        error: (err) => handleBadRequestError(err)
      })
        .catch(() => { })
    }
  }

  return (
    <Stack direction="column" spacing={2}>
      {course.status == CourseStatus.CourseArchived &&
        <Alert severity="info"
          action={access === CoursePermission.CourseAdmin &&
            <Button color="inherit" size="small" onClick={handleReactivateCourse}>
              ReActivate
            </Button>
          }>
          This course has been archived by the admin. All information is read-only.
        </Alert>
      }
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography ref={intersectionRef} variant="h5" fontWeight={600}>
          {course.code}: {course.title}
        </Typography>
      </Stack>
    </Stack>
  );
};
