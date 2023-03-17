import {
  Button,
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
    },
    {
      ID: "2",
      courseID: "string",
      name: "Hi-fi Prototype",
      optional: false,
      startDate: new Date(),
      endDate: new Date(),
      gradesByStudent: {},
    },
    {
      ID: "3",
      courseID: "string",
      name: "Web Dev",
      optional: false,
      startDate: new Date(),
      endDate: new Date(),
      gradesByStudent: {},
    },
    {
      ID: "4",
      courseID: "string",
      name: "Flutter",
      optional: true,
      startDate: new Date(),
      endDate: new Date(),
      gradesByStudent: {},
    },
  ];

  return (
    <Stack paddingTop={12} gap={4}>
      <Grid container spacing={2}>
        <Grid xs={2}></Grid>
        <Grid xs={10}>
          <CourseHeader course={course} />
          <Grid xs={2} />
          <Typography sx={{ color: "text.disabled" }}>
            Regular Section:
          </Typography>
          <Grid
            container
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography>
              {sectionID === "" ? "Unassigned" : "Section Name"}
            </Typography>
            {sectionID === "" ? (
              <Button
                variant="text"
                sx={{ color: "text.disabled" }}
                startIcon={<CalendarMonth />}
              >
                Update Your Availability
              </Button>
            ) : (
              <Button
                variant="text"
                sx={{ color: "text.disabled" }}
                startIcon={<Autorenew />}
              >
                Request Swap
              </Button>
            )}
          </Grid>
          <Grid xs={2} />
          {sectionID !== "" ? (
            <>
              <Typography sx={{ color: "text.disabled" }}>Grades:</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Assignment</TableCell>
                      <TableCell>Section</TableCell>
                      <TableCell>Grade</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assignments.map((assignment) => (
                      <TableRow key={assignment.ID}>
                        <TableCell component="th" scope="row">
                          {`${assignment.name}${
                            assignment.optional ? "" : "*"
                          }`}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          Section name
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {`1/1`}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : null}
        </Grid>
      </Grid>
    </Stack>
  );
}
