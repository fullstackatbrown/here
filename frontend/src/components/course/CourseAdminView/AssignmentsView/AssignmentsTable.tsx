import * as React from 'react';
import { FC } from "react";
import { Box, Chip, IconButton, Stack, Table, TableBody, TableContainer, TableHead, TableRow } from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiTableCell from "@mui/material/TableCell";
import CreateIcon from "@mui/icons-material/Create";
import ClearIcon from '@mui/icons-material/Clear';
import { Assignment } from 'model/assignment';

export interface AssignmentsTableProps {
  assignments: Assignment[];
}

const TableCell = styled(MuiTableCell)(({ theme }) => ({
  ":first-of-type": {
    paddingLeft: 0,
  },
  ":last-of-type": {
    width: 100,
    maxWidth: 100,
    overflow: "hidden",
  },
}))

const AssignmentsTable: FC<AssignmentsTableProps> = ({ assignments }) => {
  const handleEditAssignment = () => {
  }

  const handleDeleteAssignment = () => {
  }
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Assignment</TableCell>
          <TableCell>Due</TableCell>
          <TableCell>Point</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {assignments && assignments.map((assignment) => {
          return (
            <TableRow key={assignment.ID}>
              <TableCell component="th" scope="row">
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box>{assignment.name}</Box>
                  {assignment.optional && <Chip label="optional" variant="outlined" size="small" color="primary" />}
                </Stack>
              </TableCell>
              <TableCell component="th" scope="row">
                {assignment.endDate}
              </TableCell>
              <TableCell component="th" scope="row">
                {assignment.maxScore}
              </TableCell>
              <TableCell component="th" scope="row">
                <Stack direction="row">
                  <IconButton onClick={handleEditAssignment} size={"small"}>
                    <CreateIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={handleDeleteAssignment} size={"small"}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  )
}

export default AssignmentsTable;