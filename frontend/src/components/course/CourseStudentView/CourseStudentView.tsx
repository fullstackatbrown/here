import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Course } from "model/course";
import Grid from "@mui/material/Unstable_Grid2";
import CourseHeader from "../CourseHeader";
import { Autorenew, CalendarMonth } from "@mui/icons-material";
import { Assignment } from "model/assignment";
import { GradeChip } from "@components/shared/GradeChip/GradeChip";

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
    <Stack pt={12} gap={4}>
      <Grid container spacing={2}>
        <Grid xs={2} />
        <Grid xs={10}>
          <CourseHeader course={course} />
          <Grid xs={2} />


          <Typography color="text.disabled" variant="body2">
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
          <Grid xs={2} />
          {sectionID !== "" ? (

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ paddingLeft: 0 }}>
                    {/* <Typography variant="body2">Assignment</Typography> */}
                    Assignment
                  </TableCell>
                  <TableCell>Due</TableCell>
                  <TableCell>Section</TableCell>
                  <TableCell>Grade</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assignments.map((assignment) => (
                  <TableRow key={assignment.ID}>
                    <TableCell component="th" scope="row" sx={{ paddingLeft: 0 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box>{assignment.name}</Box>
                        {assignment.optional && <Chip label="optional" variant="outlined" size="small" color="primary" />}
                      </Stack>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {assignment.endDate.toLocaleDateString()}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      Section name
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <GradeChip score={1} maxScore={assignment.maxScore} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : null}
        </Grid>
      </Grid>
    </Stack>
  );
}
