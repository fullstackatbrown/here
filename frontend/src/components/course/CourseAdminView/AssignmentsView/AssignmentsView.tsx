import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import CreateEditAssignmentDialog from "./CreateEditAssignmentDialog";
import AssignmentsTable from "./AssignmentsTable";
import AddIcon from '@mui/icons-material/Add';
import { Course } from "model/course";
import { FC, useState } from 'react';
import { useAssignments } from "@util/assignment/hooks";


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

const Assignments: FC<AssignmentsProps> = ({ course }) => {
  const [assignments, loading] = useAssignments(course.ID)
  const [createAssignmentDialog, setCreateAssignmentDialog] = useState(false);

  return (
    <>
      <CreateEditAssignmentDialog open={createAssignmentDialog} onClose={() => { setCreateAssignmentDialog(false) }} />
      <Stack direction="row" justifyContent="space-between" mb={1}>
        <Typography variant="h6" fontWeight={600}>
          Assignments
        </Typography>
        <Button onClick={() => setCreateAssignmentDialog(true)}>
          + New
        </Button>
      </Stack>
      <AssignmentsTable assignments={assignments} />
    </>
  );
}

export default Assignments;