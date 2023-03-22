import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import CreateEditAssignmentDialog from "./CreateEditAssignmentDialog";
import AssignmentsTable from "./AssignmentsTable";
import AddIcon from '@mui/icons-material/Add';
import { Course } from "model/course";
import { FC, useEffect, useState } from 'react';
import { useAssignments } from "api/assignment/hooks";
import { useRouter } from "next/router";
import listToMap from "@util/shared/listToMap";
import { Assignment } from "model/assignment";
import GradingView from "./Grading/GradingView";

export interface AssignmentsViewProps {
  course: Course;
}

const AssignmentsView: FC<AssignmentsViewProps> = ({ course }) => {
  const router = useRouter();
  const { query } = router;
  const [assignments, loading] = useAssignments(course.ID)
  const [assignmentsMap, setAssignmentsMap] = useState<Record<string, Assignment> | null>(null)
  const [createAssignmentDialog, setCreateAssignmentDialog] = useState(false);

  useEffect(() => {
    if (assignments) {
      setAssignmentsMap(listToMap(assignments) as Record<string, Assignment>)
    }
  }, [assignments])

  const handleNavigate = (assignmentID: string) => {
    router.push(`/course/${query.courseID}?view=${query.view}&id=${assignmentID}`,
      undefined, { shallow: true })
  }

  const handleNavigateBack = () => {
    router.push(`/course/${query.courseID}?view=${query.view}`, undefined, { shallow: true })
  }

  if (assignmentsMap && query.id) {
    // Display specific assignment page
    return <GradingView course={course} assignment={assignmentsMap[query.id as string]} handleNavigateBack={handleNavigateBack} />
  }

  return (
    <>
      <CreateEditAssignmentDialog
        open={createAssignmentDialog}
        onClose={() => { setCreateAssignmentDialog(false) }}
        course={course}
      />
      <Stack direction="row" justifyContent="space-between" mb={1}>
        <Typography variant="h6" fontWeight={600}>
          Assignments
        </Typography>
        <Button onClick={() => setCreateAssignmentDialog(true)}>
          + New
        </Button>
      </Stack>
      <AssignmentsTable course={course} assignments={assignments} handleNavigate={handleNavigate} />
    </>
  );
}

export default AssignmentsView;