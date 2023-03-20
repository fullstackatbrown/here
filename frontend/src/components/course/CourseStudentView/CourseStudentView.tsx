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
import { Assignment } from "model/assignment";
import { Course } from "model/course";
import CourseAdminViewNavigation from "../CourseAdminView/CourseAdminViewNavigation";
import SectionsView from "../CourseAdminView/SectionsView/SectionsView";
import CourseHeader from "../CourseHeader";
import StudentGradesTable from "./StudentGradesTable";

export interface CourseStudentViewProps {
  course: Course;
}

export function CourseStudentView({ course }: CourseStudentViewProps) {
  const sectionID: string = "1";
  const studentID = "";
  const assignments: Assignment[] = [
    {
      ID: "1",
      courseID: "string",
      name: "Design Thinking & Low-Fi",
      optional: false,
      startDate: new Date(),
      endDate: new Date(),
      gradesByStudent: {},
      maxScore: 1,
    },
    {
      ID: "2",
      courseID: "string",
      name: "Hi-fi Prototype",
      optional: false,
      startDate: new Date(),
      endDate: new Date(),
      gradesByStudent: {},
      maxScore: 1,
    },
    {
      ID: "3",
      courseID: "string",
      name: "Web Dev",
      optional: false,
      startDate: new Date(),
      endDate: new Date(),
      gradesByStudent: {},
      maxScore: 1,
    },
    {
      ID: "4",
      courseID: "string",
      name: "Flutter",
      optional: true,
      startDate: new Date(),
      endDate: new Date(),
      gradesByStudent: {},
      maxScore: 2,
    },
  ]

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
              {sectionID === "" ? "Unassigned" : "Section Name"}
            </Typography>
            {sectionID === "" ? (
              <Button variant="text" startIcon={<CalendarMonth />}>
                Update Your Availability
              </Button>
            ) : (
              <Button startIcon={<Autorenew />}>
                Request Swap
              </Button>
            )}
          </Stack>
        </Box>
        {sectionID !== "" ? <StudentGradesTable assignments={assignments} /> : null}

      </Grid>
      <Grid xs={2} />
    </Grid>
  );
}
