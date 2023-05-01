import { Box, ButtonBase, Card, Chip, Stack, Typography } from "@mui/material";
import getCourseColor from "@util/shared/getCourseColor";
import { Course, CourseStatus } from "model/course";
import { CoursePermission, User } from "model/user";
import { useRouter } from "next/router";
import { FC } from "react";
import UserAccessChip from "./UserAccessChip";

export interface CourseCardProps {
  course: Course;
  user: User;
}

/**
 * CourseCard is a clickable card that is apart of the home page section grid. Contains the course title, section title,
 * number of tickets, location, and the ending time.
 */
const CourseCard: FC<CourseCardProps> = ({ course, user }) => {
  const router = useRouter();
  const access = user.permissions?.[course.ID] as CoursePermission || CoursePermission.CourseStudent

  return (
    <Card variant="outlined" sx={{ ':hover': { boxShadow: 2 } }}>
      <ButtonBase
        onClick={() => router.push("/course/" + course.ID)}
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
      <Box width="100%" p={2} color={"#777777"} height={55}
      >
        <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1.5}>
          {course.status === CourseStatus.CourseArchived &&
            <Chip label="Archived" size="small" color="secondary" sx={{ fontWeight: 600 }} />
          }
          <UserAccessChip access={access} size="small" />
        </Stack>
      </Box>
    </Card>
  );
};

export default CourseCard;
