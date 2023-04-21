import ClearIcon from "@mui/icons-material/Clear";
import CreateIcon from "@mui/icons-material/Create";
import { Box, Card, IconButton, Stack, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AssignmentAPI from "api/assignment/api";
import { Assignment } from "model/assignment";
import { Course, CourseStatus } from "model/course";
import { FC, useState } from "react";
import toast from "react-hot-toast";
import CreateEditAssignmentDialog from "./CreateEditAssignmentDialog";
import dayjs from "dayjs";

export interface AssignmentCardProps {
  course: Course;
  assignment: Assignment;
  handleNavigate: (assignmentID: string) => void;
}

const AssignmentCard = ({ course, assignment, handleNavigate }: AssignmentCardProps) => {
  const [editAssignmentDialog, setEditAssignmentDialog] = useState<Assignment | null>(null);
  const isCourseArchived = course.status === CourseStatus.CourseArchived;

  const handleEditAssignment = (assignment: Assignment) => {
    return (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      setEditAssignmentDialog(assignment);
    };
  };

  const handleDeleteAssignment = (assignment: Assignment) => {
    return (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      const confirmed = confirm("Are you sure you want to delete this assignment?");
      if (confirmed) {
        toast.promise(AssignmentAPI.deleteAssignment(course.ID, assignment.ID), {
          loading: "Deleting assignment...",
          success: "Deleted assignment!",
          error: "Failed to delete assignment",
        });
      }
    };
  };

  return (
    <>
      <CreateEditAssignmentDialog
        open={editAssignmentDialog !== null}
        onClose={() => {
          setEditAssignmentDialog(null);
        }}
        course={course}
        assignment={editAssignmentDialog}
      />
      <Card sx={{ ":hover": { boxShadow: 2 } }} variant={"outlined"} onClick={() => { handleNavigate(assignment.ID) }}>
        <Box display="flex" flexDirection="row" justifyContent="space-between" px={2.5} py={1.5} alignItems="center">
          <Stack spacing={0.5}>
            <Typography variant="body2" noWrap>
              {assignment.name}
            </Typography>
            <Stack
              spacing={{
                xs: 0,
                md: 2,
              }}
              direction={{ xs: "column", md: "row" }}
              sx={{
                color: "text.disabled",
              }}
            >
              <Typography
                variant="body2"
                fontWeight={400}
                sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1 }}
              >
                Release: {dayjs(assignment.releaseDate).format("MMM D, YYYY")}
              </Typography>
              <Typography
                variant="body2"
                fontWeight={400}
                sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1 }}
              >
                Due: {dayjs(assignment.dueDate).format("MMM D, YYYY")}
              </Typography>
              <Typography
                variant="body2"
                fontWeight={400}
                sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1 }}
              >
                Points: {assignment.maxScore}
              </Typography>
            </Stack>
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} alignItems="center" justifyContent="center">
            <IconButton onClick={handleEditAssignment(assignment)} size={"small"} disabled={isCourseArchived}>
              <CreateIcon fontSize="small" />
            </IconButton>
            <IconButton onClick={handleDeleteAssignment(assignment)} size={"small"} disabled={isCourseArchived}>
              <ClearIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      </Card>
    </>
  );
};

export default AssignmentCard;
