import * as React from 'react';
import { FC, useState } from "react";
import { Box, Chip, IconButton, Stack, Table, TableBody, TableContainer, TableHead, TableRow } from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiTableCell from "@mui/material/TableCell";
import CreateIcon from "@mui/icons-material/Create";
import ClearIcon from '@mui/icons-material/Clear';
import { Assignment } from 'model/assignment';
import dayjs from 'dayjs';
import CreateEditAssignmentDialog from './CreateEditAssignmentDialog';
import { sortAssignments } from '@util/shared/assignments';
import toast from 'react-hot-toast';
import AssignmentAPI from 'api/assignment/api';
import { Course } from 'model/course';
import { useRouter } from 'next/router';

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
}))

const AssignmentsTable: FC<AssignmentsTableProps> = ({ course, assignments, handleNavigate }) => {
  const [editAssignmentDialog, setEditAssignmentDialog] = useState<Assignment | null>(null);

  const handleDeleteAssignment = (assignment: Assignment) => {
    return () => {
      const confirmed = confirm("Are you sure you want to delete this assignment?");
      if (confirmed) {
        toast.promise(AssignmentAPI.deleteAssignment(course.ID, assignment.ID), {
          loading: "Deleting assignment...",
          success: "Deleted assignment!",
          error: "Failed to delete assignment",
        })
      }
    }
  }

  return (
    <>
      <CreateEditAssignmentDialog
        open={editAssignmentDialog !== null}
        onClose={() => { setEditAssignmentDialog(null) }}
        course={course}
        assignment={editAssignmentDialog} />
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
          {assignments && sortAssignments(assignments).map((assignment) => {
            return (
              <TableRow key={assignment.ID} hover onClick={() => { handleNavigate(assignment.ID) }}>
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
                  {assignment.maxScore}
                </TableCell>
                <TableCell component="th" scope="row">
                  <Stack direction="row">
                    <IconButton onClick={() => { setEditAssignmentDialog(assignment) }} size={"small"}>
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
  )
}

export default AssignmentsTable;