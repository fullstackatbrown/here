import * as React from 'react';
import { FC } from "react";
import { Box, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';

export interface AssignmentsTableProps {
  rows: { 
    assignment: string,
    dueDate: string,
    points: number,
    required: boolean,
  }[];
}

const AssignmentsTable: FC<AssignmentsTableProps> = ({ rows }) => {
  return (
    <TableContainer>
      <Table sx={{ minWidth: 600 }} aria-label="assignment table">
        <TableHead>
          <TableRow>
            <TableCell align="left" variant="footer" padding="none"> Assignment</TableCell>
            <TableCell align="left" variant="footer">Due</TableCell>
            <TableCell align="left" variant="footer">Points</TableCell>
            <TableCell align="right" variant="footer"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.assignment}                    >
              <TableCell component="th" scope="row" align="left" padding="none">
                {row.assignment}
                {row.required ? "" : "*"}
              </TableCell>
              <TableCell>{row.dueDate}</TableCell>
              <TableCell>{row.points}</TableCell>
              <TableCell align="right" padding="none">

                <Box sx={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'right' }}>
                  <IconButton>
                    <ClearIcon color="secondary" />
                  </IconButton>

                  <IconButton>
                    <EditIcon color="secondary" />
                  </IconButton>
                </Box>

              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default AssignmentsTable;