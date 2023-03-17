import { Box, ButtonBase, Paper, Stack, Typography } from "@mui/material";
import getCourseColor from "@util/shared/getCourseColor";
import { Course } from "model/course";
import { useRouter } from "next/router";
import { FC } from "react";
import UserAccessChip from "./UserAccessChip";

export interface CourseCardProps {
  course: Course;
}

/**
 * CourseCard is a clickable card that is apart of the home page section grid. Contains the course title, section title,
 * number of tickets, location, and the ending time.
 */
const CourseCard: FC<CourseCardProps> = ({ course }) => {
  const router = useRouter();

  return (
    <Paper variant="outlined" sx={{ overflow: "hidden" }}>
      <ButtonBase
        onClick={() => router.push("/course/" + course.code)}
        sx={{ width: "100%", textAlign: "left" }}
        focusRipple
      >
        <Box
          width="100%"
          height={125}
          p={2}
          color="#fff"
          sx={{ bgcolor: getCourseColor(course) }}
        >
          <Typography variant="body1" noWrap>
            {course.code}
          </Typography>
          <Typography variant="h6" fontWeight={600}>
            {course.title}
          </Typography>
        </Box>
      </ButtonBase>
      <Box width="100%" p={2} color={"#777777"}
      // sx={{ bgcolor: "#78909c" }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="body2" noWrap>
            {course.assignmentIDs.length > 0 ? course.assignmentIDs.length : "No Assignments"}
          </Typography>
          <UserAccessChip access="student" size="small" />
        </Stack>
      </Box>
    </Paper>
  );
};

export default CourseCard;
