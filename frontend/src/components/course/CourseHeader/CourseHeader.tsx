import { Box, Paper, Typography } from "@mui/material";
import { Course } from "model/course";
import { FC } from "react";

export interface CourseHeaderProps {
  course: Course;
}

export const CourseHeader: FC<CourseHeaderProps> = ({ course }) => {
  return (
    <Box width="100%" position="relative">
      <Typography variant="h5" fontWeight={600}>
        {course.code}: {course.title}
      </Typography>
    </Box>
  );
}
