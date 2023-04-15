import { Stack, Typography } from "@mui/material";
import { Course } from "model/course";
import { FC } from "react";

export interface CourseHeaderProps {
  intersectionRef: (node?: Element) => void;
  course: Course;
}

export const CourseHeader: FC<CourseHeaderProps> = ({ intersectionRef, course }) => {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Typography ref={intersectionRef} variant="h5" fontWeight={600}>
        {course.code}: {course.title}
      </Typography>
    </Stack>
  );
};
