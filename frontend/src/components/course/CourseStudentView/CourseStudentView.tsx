import { GradeChip } from "@components/shared/GradeChip/GradeChip";
import { Autorenew, CalendarMonth } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip, Stack,
  Table,
  TableBody,
  TableCell, TableHead,
  TableRow,
  Typography
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useAssignments } from "@util/assignment/hooks";
import { useSurvey } from "@util/surveys/hooks";
import { Assignment } from "model/assignment";
import { Course } from "model/course";
import { User } from "model/user";
import { useState } from "react";
import CourseAdminViewNavigation from "../CourseAdminView/CourseAdminViewNavigation";
import SurveyDialog from "../CourseAdminView/SectionsView/AvailabilitySurvey/SurveyDialog";
import SectionsView from "../CourseAdminView/SectionsView/SectionsView";
import CourseHeader from "../CourseHeader";
import StudentGradesTable from "./StudentGradesTable";

export interface CourseStudentViewProps {
  course: Course;
}

const student: User = {
  ID: "p3d5eSnr3H621G3SwzEL",
  displayName: "Student Name",
  email: "",
  access: {},
  courses: ["r5fOh8uw28B0uM2GAPNf"],
  defaultSection: { "r5fOh8uw28B0uM2GAPNf": "" },
  actualSection: { "r5fOh8uw28B0uM2GAPNf": {} },
}

export function CourseStudentView({ course }: CourseStudentViewProps) {
  const [assignments, assignmentsLoading] = useAssignments()
  const [survey, surveyLoading] = useSurvey(course.surveyID || undefined);
  const [surveyDialog, setSurveyDialog] = useState(false)

  const hasAssignedSection = () => (student.defaultSection[course.ID] && student.defaultSection[course.ID] !== "")
  const hasFilledOutSurvey = () => {
    if (survey && survey.responses) {
      return survey.responses[student.ID] !== undefined
    }
  }

  const handleRequestSwap = () => {
  }

  const handleFillSurvey = () => {
    setSurveyDialog(true)
  }

  const handleUpdateSurvey = () => {
    setSurveyDialog(true)
  }


  return (
    <>
      {surveyDialog &&
        <SurveyDialog
          open={surveyDialog}
          onClose={() => { setSurveyDialog(false) }}
          survey={survey}
          studentID={student.ID}
        />}
      <Grid container>
        <Grid xs={2}>
        </Grid>
        <Grid xs>
          <Box mb={2}>
            <Typography color="text.secondary" variant="body2">
              Regular Section:
            </Typography>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography>
                {hasAssignedSection() ? "Unassigned" : "Section Name"}
              </Typography>
              {hasAssignedSection() ?
                <Button startIcon={<Autorenew />} onClick={handleRequestSwap}>Request Swap</Button> :
                // TODO: check if course has survey
                (hasFilledOutSurvey() ?
                  <Button variant="text" startIcon={<CalendarMonth />} onClick={handleUpdateSurvey}>Update Your Availability</Button> :
                  <Button variant="text" startIcon={<CalendarMonth />} onClick={handleFillSurvey}> Indicate Your Availability</Button>)}
            </Stack>
          </Box>
          {(assignments && assignments.length > 0) ?
            <StudentGradesTable assignments={assignments} student={student} /> :
            <Typography>Your instructor has not published any assignments yet</Typography>}

        </Grid>
        <Grid xs={2} />
      </Grid>
    </>
  );
}
