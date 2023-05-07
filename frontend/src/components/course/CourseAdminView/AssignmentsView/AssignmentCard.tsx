import { useDialog } from "@components/shared/ConfirmDialog/ConfirmDialogProvider";
import ClearIcon from "@mui/icons-material/Clear";
import CreateIcon from "@mui/icons-material/Create";
import { Box, Card, IconButton, Stack, Typography } from "@mui/material";
import { handleBadRequestError } from "@util/errors";
import AssignmentAPI from "api/assignment/api";
import dayjs from "dayjs";
import { Assignment } from "model/assignment";
import { Course, CourseStatus } from "model/course";
import { useState } from "react";
import toast from "react-hot-toast";
import CreateEditAssignmentDialog from "./CreateEditAssignmentDialog";
import MyChip from "@components/shared/MyChip/MyChip";

export interface AssignmentCardProps {
  course: Course;
  assignment: Assignment;
  handleNavigate: (assignmentID: string) => void;
  admin: boolean;
}

const AssignmentCard = ({ course, assignment, handleNavigate, admin }: AssignmentCardProps) => {
  const [editAssignmentDialog, setEditAssignmentDialog] = useState<Assignment | null>(null);
  const isCourseActive = course.status === CourseStatus.CourseActive;

  const showDialog = useDialog();

  const handleDeleteAssignment = (assignment: Assignment) => {
    return async (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      const confirmed = await showDialog({
        title: 'Delete Assignment',
        message: "Are you sure you want to delete this assignment? This action cannot be undone.",
        warning: assignment.grades && Object.keys(assignment.grades).length > 0
          && "Deleting this section will delete all student grades."
      });

      if (confirmed) {
        toast.promise(AssignmentAPI.deleteAssignment(course.ID, assignment.ID), {
          loading: "Deleting assignment...",
          success: "Deleted assignment!",
          error: (err) => handleBadRequestError(err),
        });
      }
    };
  };

  const handleEditAssignment = (assignment: Assignment) => {
    return (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      setEditAssignmentDialog(assignment);
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
            <Stack direction="row" alignItems="center" mb={0.5}>
              <Typography variant="body2">
                {assignment.name}
              </Typography>
              {assignment.optional && <MyChip label="optional" variant="outlined" color="primary" style={{ marginLeft: 6 }} />}
            </Stack>
            <Stack
              spacing={{ xs: 0, md: 2, }}
              direction={{ xs: "column", md: "row" }}
              sx={{ color: "text.disabled" }}
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

          {admin &&
            <Stack direction="row" alignItems="center" justifyContent="center">
              <IconButton onClick={handleEditAssignment(assignment)} size={"small"} disabled={!isCourseActive}>
                <CreateIcon fontSize="small" />
              </IconButton>
              <IconButton onClick={handleDeleteAssignment(assignment)} size={"small"} disabled={!isCourseActive}>
                <ClearIcon fontSize="small" />
              </IconButton>
            </Stack>
          }
        </Box>
      </Card>
    </>
  );
};

export default AssignmentCard;
