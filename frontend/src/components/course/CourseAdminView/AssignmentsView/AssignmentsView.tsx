import MoreMenu from "@components/shared/Menu/MoreMenu";
import ViewHeader from "@components/shared/ViewHeader/ViewHeader";
import { Button, Stack, Typography } from "@mui/material";
import { sortAssignments } from "@util/shared/assignments";
import { exportGrades } from "@util/shared/export";
import { Assignment } from "model/assignment";
import { Course, CourseStatus } from "model/course";
import { Section } from "model/section";
import { CoursePermission } from "model/user";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import AssignmentCard from "./AssignmentCard";
import CreateEditAssignmentDialog from "./CreateEditAssignmentDialog";
import GradingView from "./Grading/GradingView";
import toast from "react-hot-toast";

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

  const handleExportGrade = () => {
    if (!course.students || Object.keys(course.students).length === 0) {
      toast.error("Cannot export grades: no students in this course")
      return
    }
    exportGrades(course, assignments)
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
      <ViewHeader
        view="assignments"
        course={course}
        access={access}
        endElement={access === CoursePermission.CourseAdmin && (
          <Stack direction="row">
            <Button disabled={course.status === CourseStatus.CourseArchived} onClick={() => setCreateAssignmentDialog(true)}>
              + New
            </Button>
            <MoreMenu keys={["Export Grades"]} handlers={[handleExportGrade]} />
          </Stack>
        )}
      />
      {assignments?.length == 0 && (
        <Typography textAlign="center" mt={3}>
          {access === CoursePermission.CourseAdmin
            ? "Add the first assignment here"
            : "No assignment has been added yet."}
        </Typography>
      )}
      <Stack direction="column" spacing={2} mb={5}>
        {assignments && sortAssignments(assignments).map((assignment) => (
          <AssignmentCard
            key={assignment.ID}
            course={course} assignment={assignment}
            handleNavigate={handleNavigate}
            admin={access === CoursePermission.CourseAdmin}
          />
        ))}
      </Stack>
    </>
  );
};

export default AssignmentsView;
