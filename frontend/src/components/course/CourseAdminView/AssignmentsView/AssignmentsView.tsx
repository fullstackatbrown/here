import { Button, Stack, Typography } from "@mui/material";
import { Assignment } from "model/assignment";
import { Course } from "model/course";
import { Section } from "model/section";
import { CoursePermission } from "model/user";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from 'react';
import AssignmentsTable from "./AssignmentsTable";
import CreateEditAssignmentDialog from "./CreateEditAssignmentDialog";
import GradingView from "./Grading/GradingView";
import { CoursePermission } from "model/user";
import { useAssignments } from "api/assignment/hooks";
import listToMap from "@util/shared/listToMap";

export interface AssignmentsViewProps {
  course: Course;
  access: CoursePermission;
}

const AssignmentsView: FC<AssignmentsViewProps> = ({ course, access }) => {
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
    return (
      <GradingView
        course={course}
        assignment={assignmentsMap[query.id as string]}
        handleNavigateBack={handleNavigateBack} />
    )
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
        {access === CoursePermission.CourseAdmin &&
          <Button onClick={() => setCreateAssignmentDialog(true)}>
            + New
          </Button>
        }
      </Stack>
      {assignments?.length == 0 &&
        <Typography textAlign="center" mt={3}>
          {access === CoursePermission.CourseAdmin ?
            "Add the first assignment here" :
            "No assignment has been added yet."
          }
        </Typography>
      }
      {assignments?.length > 0 && <AssignmentsTable course={course} assignments={assignments} handleNavigate={handleNavigate} />}
    </>
  );
}

export default AssignmentsView;