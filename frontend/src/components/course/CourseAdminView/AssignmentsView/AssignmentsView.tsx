import MoreMenu from "@components/shared/Menu/MoreMenu";
import { Button, Stack, Typography } from "@mui/material";
import { Assignment } from "model/assignment";
import { Course, CourseStatus } from "model/course";
import { Section } from "model/section";
import { CoursePermission } from "model/user";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import ViewHeader from "../ViewHeader/ViewHeader";
import AssignmentCard from "./AssignmentCard";
import CreateEditAssignmentDialog from "./CreateEditAssignmentDialog";
import GradingView from "./Grading/GradingView";
import { exportGrades } from "@util/shared/export";

export interface AssignmentsViewProps {
  course: Course;
  access: CoursePermission;
  sectionsMap: Record<string, Section>;
  assignmentsMap: Record<string, Assignment>;
}

const AssignmentsView: FC<AssignmentsViewProps> = ({ course, access, sectionsMap, assignmentsMap }) => {
  const router = useRouter();
  const { query } = router;
  const assignments = Object.values(assignmentsMap);
  const [createAssignmentDialog, setCreateAssignmentDialog] = useState(false);

  const handleNavigate = (assignmentID: string) => {
    router.push(`/course/${query.courseID}?view=${query.view}&id=${assignmentID}`, undefined, { shallow: true });
  };

  const handleNavigateBack = () => {
    router.push(`/course/${query.courseID}?view=${query.view}`, undefined, { shallow: true });
  };

  if (assignmentsMap && query.id) {
    // Display specific assignment page
    return (
      <GradingView
        {...{ course, sectionsMap, access }}
        assignment={assignmentsMap[query.id as string]}
      />
    );
  }

  return (
    <>
      <CreateEditAssignmentDialog
        open={createAssignmentDialog}
        onClose={() => {
          setCreateAssignmentDialog(false);
        }}
        course={course}
      />
      <Stack direction="row" justifyContent="space-between" mb={1} alignItems="center" height={40}>
        <ViewHeader view="assignments" views={["sections", "assignments", "people", "requests", "settings"]} access={access} />
        {access === CoursePermission.CourseAdmin && (
          <Stack direction="row">
            <Button disabled={course.status === CourseStatus.CourseArchived} onClick={() => setCreateAssignmentDialog(true)}>
              + New
            </Button>
            <MoreMenu keys={["Export Grades"]} handlers={[() => { exportGrades(course, assignments) }]} />
          </Stack>
        )}
      </Stack>
      {assignments?.length == 0 && (
        <Typography textAlign="center" mt={3}>
          {access === CoursePermission.CourseAdmin
            ? "Add the first assignment here"
            : "No assignment has been added yet."}
        </Typography>
      )}
      {/* {assignments?.length > 0 && <AssignmentsTable {...{ course, assignments }} handleNavigate={handleNavigate} />} */}
      {assignments &&
        assignments.map((assignment) => (
          <AssignmentCard key={assignment.ID} course={course} assignment={assignment} handleNavigate={handleNavigate} />
        ))}
    </>
  );
};

export default AssignmentsView;
