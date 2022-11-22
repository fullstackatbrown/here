import { Box, Paper, Typography } from "@mui/material";
import { Course } from "model/general";

export interface CourseHeaderProps {
      course: Course;
}

export function CourseHeader(props: CourseHeaderProps) {
      return <Paper sx={{ overflow: "hidden" }}>
            <Box width="100%" p={[2, null, 3]} color="#fff" position="relative">
                  <Box height={120}>
                  </Box>
                  <Typography variant="h4" fontWeight={600}>
                        {props.course.code}: {props.course.title}
                  </Typography>
            </Box>
      </Paper>;


}