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
import { Assignment } from "model/assignment";
import { Course } from "model/course";
import { User } from "model/user";
import CourseAdminViewNavigation from "../CourseAdminView/CourseAdminViewNavigation";
import SectionsView from "../CourseAdminView/SectionsView/SectionsView";
import CourseHeader from "../CourseHeader";
import StudentGradesTable from "./StudentGradesTable";

export interface CourseStudentViewProps {
  course: Course;
}

const student: User = {
  ID: "1",
  displayName: "Student Name",
  email: "",
  access: {},
  courses: ["r5fOh8uw28B0uM2GAPNf"],
  defaultSection: { "r5fOh8uw28B0uM2GAPNf": "" },
  actualSection: { "r5fOh8uw28B0uM2GAPNf": {} },
}

export function CourseStudentView({ course }: CourseStudentViewProps) {
  const [assignments, loading] = useAssignments()

  const hasAssignedSection = () => (student.defaultSection[course.ID] && student.defaultSection[course.ID] !== "")
  const hasFilledOutSurvey = () => {
    // TODO: get survey
    // check the responses field of survey and see if the student results are inside
    return true
  }

  const handleRequestSwap = () => {
  }

  const handleFillSurvey = () => {
  }

  const handleUpdateSurvey = () => {
  }


  return (
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
  );
}
