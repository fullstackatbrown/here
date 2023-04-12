import { Box, ButtonBase, Card, IconButton, Paper, Stack, Tooltip, Typography } from "@mui/material";
import getCourseColor from "@util/shared/getCourseColor";
import { Course, CourseStatus } from "model/course";
import { useRouter } from "next/router";
import { FC } from "react";
import UserAccessChip from "./UserAccessChip";
import { CoursePermission, User } from "model/user";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

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

  const getAccess = (): CoursePermission => {
    const permission = user.permissions[course.ID];
    return permission as CoursePermission || CoursePermission.CourseStudent
  }

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
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Typography variant="h6" fontWeight={600}>
              {course.title}
            </Typography>
            {course.status === CourseStatus.CourseArchived &&
              <Tooltip title="Archived by the instructor" placement="right">
                <LockOutlinedIcon sx={{ fontSize: 18 }} />
              </Tooltip>}
          </Stack>
        </Box>
      </ButtonBase>
      <Box width="100%" p={2} color={"#777777"} height={55}
      // sx={{ bgcolor: "#78909c" }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="body2" noWrap>
            {/* {numAssignments > 0 ? `${numAssignments} Assignments` : "No Assignments"} */}
          </Typography>

          <UserAccessChip access={getAccess()} size="small" />
        </Stack>
      </Box>
    </Card>
  );
};

export default CourseCard;
