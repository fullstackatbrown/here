import * as React from 'react';
import { Box, Typography, Stack, Button, Grid, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { LocalizationProvider, DateField } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import AssignmentDialog from "./AssignmentDialog"
import AssignmentsTable from "./AssignmentsTable"

import { Course } from "model/course";
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';


export interface AssignmentsProps {
  course: Course;
}

function createData(
  assignment: string,
  dueDate: string,
  points: number,
  required: boolean,
) {
  return { assignment, dueDate, points, required };
}

const rows = [
  createData('Design Thinking', "1 January 2023", 6.0, true),
  createData('High-Five Prototype', "1 January 2023", 9.0, true),
  createData('Web Dev', "1 January 2023", 16.0, true),
  createData('Flutter', "1 January 2023", 3.7, false),
];

export default function Assignments(props: AssignmentsProps) {

  const [assignmentDialog, setAssignmentDialog] = React.useState(false);

  const handleOpen = () => {
    setAssignmentDialog(true);
  };

  const handleClose = () => {
    setAssignmentDialog(false);
  };

  return (
    <>
      <Grid container>
        <Grid item xs>
          <Typography variant="h6" fontWeight={600}>
            All Assignments
          </Typography>
        </Grid>

        <Grid item>
          <Box display="flex">
            <Button variant="text" onClick={handleOpen}>
              <AddIcon color="secondary" fontSize="small" />
              <Typography variant="body2" color="secondary">
                New
              </Typography>
            </Button>

            <AssignmentDialog open={assignmentDialog} handleClose={handleClose} />

          </Box>
        </Grid>
      </Grid>

      <AssignmentsTable rows={rows} />

    </>
    // <>
    //   <Typography variant="h6" fontWeight={600}>
    //     Assignments
    //   </Typography>
    //   <Grid>
    //     <Stack direction="row" spacing={5} alignItems="center" justifyContent="space-between">
    //       <Stack direction="row" spacing={2} alignItems="center">
    //         <Typography variant="body2">
    //           Studio 1: Design Thinking & Low-fi Prototype

    //         </Typography>
    //         <Typography sx={{ fontWeight: 'light', fontSize: "0.8rem" }}>
    //           {false ? "*Required (365/400 finished)" : "Optional (229/400 finished)"}
    //         </Typography>
    //       </Stack>

    //       <Stack direction="row" spacing={2}>

    //         <EditIcon
    //           color="secondary"
    //         />

    //         <ClearIcon
    //           color="secondary"
    //         />


    //       </Stack>
    //     </Stack>
    //   </Grid>

    //     {/* {props.course.assignments.map(assignment => (
    //       <Stack direction="row" spacing={5} alignItems="center" justifyContent="space-between">
    //         <Stack direction="row" spacing={2} alignItems="center">
    //           <Typography variant="body1">
    //             {assignment.name}
    //           </Typography>
    //           <Typography sx={{ fontWeight: 'light', fontSize: "0.8rem" }}>

    //             {assignment.mandatory ? "*Required (365/400 finished)" : "Optional (229/400 finished)"}

    //           </Typography>
    //         </Stack>

    //         <EditIcon
    //           color="secondary"
    //         />
    //         <ClearIcon
    //           color="secondary"
    //         />
    //       </Stack>
    //     ))} */}

    // </>
  );
}