import { Autorenew, CalendarMonth } from "@mui/icons-material";
import {
  Box,
  Button, Stack, Typography
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useAssignments } from "api/assignment/hooks";
import { useSections, useSectionsMap } from "api/section/hooks";
import formatSectionInfo from "@util/shared/formatSectionInfo";
import listToMap from "@util/shared/listToMap";
import { useSurvey } from "api/surveys/hooks";
import { Course } from "model/course";
import { User } from "model/user";
import { useState } from "react";
import SurveyDialog from "../CourseAdminView/SectionsView/AvailabilitySurvey/SurveyDialog";
import StudentGradesTable from "./StudentGradesTable";
import SwapRequestDialog from "./SwapRequestDialog";
import { Section } from "model/section";
import { filterAssignmentsByReleaseDate } from "@util/shared/assignments";

export interface CourseStudentViewProps {
  course: Course;
}

const student: User = {
  ID: "p3d5eSnr3H621G3SwzEL",
  displayName: "Student Name",
  email: "",
  access: {},
  courses: ["2dIFx5URWkWZjfL4D6Ta"],
  defaultSection: { "2dIFx5URWkWZjfL4D6Ta": "Sunday,4:00AM,6:00PM,cit244" },
  actualSection: { "2dIFx5URWkWZjfL4D6Ta": {} },
}

function CourseStudentView({ course }: CourseStudentViewProps) {
  const [assignments, assignmentsLoading] = useAssignments(course.ID)
  const [sectionsMap, sectionsMapLoading] = useSectionsMap(course.ID)
  const [survey, surveyLoading] = useSurvey(course.ID || undefined);
  const [surveyDialog, setSurveyDialog] = useState(false)
  const [swapRequestDialog, setSwapRequestDialog] = useState(false)

  const getAssignedSection = () => {
    const defaultSection = student.defaultSection[course.ID]
    if (defaultSection && defaultSection !== "" && sectionsMap) {
      const section = sectionsMap[defaultSection] as Section
      return formatSectionInfo(section)
    }
    return undefined
  }

  const hasFilledOutSurvey = () => {
    if (survey && survey.responses) {
      return survey.responses[student.ID] !== undefined
    }
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
      <SwapRequestDialog
        open={swapRequestDialog}
        onClose={() => { setSwapRequestDialog(false) }}
        course={course}
        assignments={assignments}
        student={student}
        sectionsMap={sectionsMap}
      />
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
                {getAssignedSection() || "Unassigned"}
              </Typography>
              {getAssignedSection() !== undefined ?
                <Button startIcon={<Autorenew />} onClick={() => { setSwapRequestDialog(true) }}>Request Swap</Button> :
                // TODO: check if course has survey
                (hasFilledOutSurvey() ?
                  <Button variant="text" startIcon={<CalendarMonth />} onClick={() => { setSurveyDialog(true) }}>Update Your Availability</Button> :
                  <Button variant="text" startIcon={<CalendarMonth />} onClick={() => { setSurveyDialog(true) }}> Indicate Your Availability</Button>)}
            </Stack>
          </Box>
          {(assignments && filterAssignmentsByReleaseDate(assignments).length > 0) ?
            <StudentGradesTable course={course} assignments={filterAssignmentsByReleaseDate(assignments)} student={student} sectionsMap={sectionsMap} /> :
            <Typography>Your instructor has not released any assignments yet</Typography>}
        </Grid>
        <Grid xs={2} />
      </Grid>
    </>
  );
}

export default CourseStudentView