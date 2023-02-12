import React, { FC } from "react";
import { Box, ButtonBase, Paper, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { Course } from "model/general";
import getCourseColor from "@util/shared/getCourseColor";
import BackpackIcon from "@mui/icons-material/Backpack";
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { AccessTime } from "@mui/icons-material";

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
          <Typography variant="h5" fontWeight={600}>
            {course.title}
          </Typography>
        </Box>
      </ButtonBase>
      <Box width="100%" p={2} color={"#777777"}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
            <Stack direction="row" spacing={0.5} alignItems="center">
              <BackpackIcon />
              {/* TODO: use user's role */}
              { false && <VerifiedUserIcon /> }
              <Typography variant="body2" noWrap>
                {/* TODO: use user's role */}
                Student
              </Typography>
            </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <AccessTime />
            <Typography variant="body2" noWrap>
              {/* TODO: format date and time */}
              Thursday 4:00PM - 5:00PM
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
};

export default CourseCard;
