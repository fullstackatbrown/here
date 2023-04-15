import ClearIcon from "@mui/icons-material/Clear";
import CreateIcon from "@mui/icons-material/Create";
import { Box, Chip, IconButton, Stack, Table, TableBody, TableHead, TableRow, useMediaQuery } from "@mui/material";
import MuiTableCell from "@mui/material/TableCell";
import { styled, useTheme } from "@mui/material/styles";
import { sortAssignments } from "@util/shared/assignments";
import AssignmentAPI from "api/assignment/api";
import dayjs from "dayjs";
import { Assignment } from "model/assignment";
import { Course } from "model/course";
import * as React from "react";
import { FC, useState } from "react";
import toast from "react-hot-toast";
import CreateEditAssignmentDialog from "./CreateEditAssignmentDialog";

export interface AssignmentsTableProps {
  course: Course;
  assignments: Assignment[];
  handleNavigate: (assignmentID: string) => void;
}

const TableCell = styled(MuiTableCell)(({ theme }) => ({
  ":first-of-type": {
    paddingLeft: 0,
  },
  ":last-of-type": {
    width: 80,
    maxWidth: 80,
    overflow: "hidden",
  },
}));

const AssignmentsTable: FC<AssignmentsTableProps> = ({ course, assignments, handleNavigate }) => {
  const [editAssignmentDialog, setEditAssignmentDialog] = useState<Assignment | null>(null);
  const theme = useTheme();
  const betweenSmalltoMid = useMediaQuery(theme.breakpoints.between("xs", "md"));

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
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Assignment</TableCell>
            <TableCell>Release</TableCell>
            <TableCell>Due</TableCell>
            <TableCell>Point</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {assignments &&
            sortAssignments(assignments).map((assignment) => {
              return (
                <TableRow
                  key={assignment.ID}
                  hover
                  onClick={() => {
                    handleNavigate(assignment.ID);
                  }}
                >
                  <TableCell component="th" scope="row">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box>{assignment.name}</Box>
                      {assignment.optional && <Chip label="optional" variant="outlined" size="small" color="primary" />}
                    </Stack>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {dayjs(assignment.releaseDate).format("MMM D, YYYY")}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {dayjs(assignment.dueDate).format("MMM D, YYYY")}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    &nbsp;{assignment.maxScore}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <Stack direction={{ xs: "column", md: "row" }}>
                      <IconButton onClick={handleEditAssignment(assignment)} size={"small"}>
                        <CreateIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={handleDeleteAssignment(assignment)} size={"small"}>
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </>
  );
};

export default AssignmentsTable;
