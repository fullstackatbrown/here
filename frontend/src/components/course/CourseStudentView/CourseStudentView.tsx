import { Autorenew, CalendarMonth } from "@mui/icons-material";
import {
  Box,
  Button, Stack, Typography
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useAssignments } from "api/assignment/hooks";
import { useSections } from "api/section/hooks";
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

export interface CourseStudentViewProps {
  course: Course;
}

const student: User = {
  ID: "p3d5eSnr3H621G3SwzEL",
  displayName: "Student Name",
  email: "",
  access: {},
  courses: ["r5fOh8uw28B0uM2GAPNf"],
  defaultSection: { "r5fOh8uw28B0uM2GAPNf": "35s1joLA4EBawZqKpyeX" },
  actualSection: { "r5fOh8uw28B0uM2GAPNf": {} },
}

export function CourseStudentView({ course }: CourseStudentViewProps) {
  const [assignments, assignmentsLoading] = useAssignments(course.ID)
  const [sections, sectionsLoading] = useSections(course.ID)
  const [survey, surveyLoading] = useSurvey(course.ID || undefined);
  const [surveyDialog, setSurveyDialog] = useState(false)
  const [swapRequestDialog, setSwapRequestDialog] = useState(false)

  const getAssignedSection = () => {
    const defaultSection = student.defaultSection[course.ID]
    if (defaultSection && defaultSection !== "" && sections) {
      const section = listToMap(sections)[defaultSection] as Section
      return formatSectionInfo(section)
    }
    return undefined
  }

  const hasFilledOutSurvey = () => {
    if (survey && survey.responses) {
      return survey.responses[student.ID] !== undefined
    }
  }

  const handleRequestSwap = () => {
    setSwapRequestDialog(true)
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
      <SwapRequestDialog
        open={swapRequestDialog}
        onClose={() => { setSwapRequestDialog(false) }}
        course={course}
        assignments={assignments}
        student={student}
        sections={sections}
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
                <Button startIcon={<Autorenew />} onClick={handleRequestSwap}>Request Swap</Button> :
                // TODO: check if course has survey
                (hasFilledOutSurvey() ?
                  <Button variant="text" startIcon={<CalendarMonth />} onClick={handleUpdateSurvey}>Update Your Availability</Button> :
                  <Button variant="text" startIcon={<CalendarMonth />} onClick={handleFillSurvey}> Indicate Your Availability</Button>)}
            </Stack>
          </Box>
          {(assignments && assignments.length > 0) ?
            <StudentGradesTable assignments={assignments} student={student} sections={sections} /> :
            <Typography>Your instructor has not published any assignments yet</Typography>}
        </Grid>
        <Grid xs={2} />
      </Grid>
    </>
  );
}
