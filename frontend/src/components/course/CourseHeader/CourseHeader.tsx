import { Stack, Typography } from "@mui/material";
import { Course } from "model/course";
import { FC } from "react";

export interface CourseHeaderProps {
  course: Course;
}

export const CourseHeader: FC<CourseHeaderProps> = ({ course }) => {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Typography variant="h5" fontWeight={600}>
        {course.code}: {course.title}
      </Typography>
    </Stack>
  );
}
