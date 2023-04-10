import { Autorenew, CalendarMonth } from "@mui/icons-material";
import {
  Box,
  Button, IconButton, Stack, Tooltip, Typography
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import formatSectionInfo from "@util/shared/formatSectionInfo";
import { useAssignments } from "api/assignment/hooks";
import { useSectionsMap } from "api/section/hooks";
import { useSurvey } from "api/surveys/hooks";
import { Course } from "model/course";
import { Section } from "model/section";
import { User } from "model/user";
import { useState } from "react";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SurveyDialog from "../CourseAdminView/SectionsView/AvailabilitySurvey/SurveyDialog";
import StudentViewList from "./StudentViewList";

export interface CourseStudentViewProps {
  course: Course;
}

const student: User = {
  ID: "2V5CjjV6Z7fbOAFwO2TI",
  displayName: "Student Name",
  email: "",
  access: {},
  courses: ["2dIFx5URWkWZjfL4D6Ta"],
  defaultSection: { "2dIFx5URWkWZjfL4D6Ta": "Sunday,4:00AM,6:00PM,cit244" },
  actualSection: { "2dIFx5URWkWZjfL4D6Ta": {} },
}

function CourseStudentView({ course }: CourseStudentViewProps) {
  const [sectionsMap, sectionsMapLoading] = useSectionsMap(course.ID)
  const [survey, surveyLoading] = useSurvey(course.ID || undefined);
  const [surveyDialog, setSurveyDialog] = useState(false)

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

      <Grid container>
        <Grid xs={2}>
        </Grid>
        <Grid xs>
          {/* <Box mt={1}> */}
          <Box height={10} />
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="button" fontSize={17}>
              Regular Section:
            </Typography>
            <Typography variant="button" fontSize={17} fontWeight={400}>
              {getAssignedSection() || "Unassigned"}
            </Typography>
            <Tooltip title="This is the default section you will attend if you have not requested a swap for a particular assignment." placement="right">
              <IconButton sx={{ p: 0.5 }}>
                <HelpOutlineIcon fontSize="small" color="secondary" />
              </IconButton>
            </Tooltip>
          </Stack>
          {/* 
              {
                // TODO: check if course has survey
                (hasFilledOutSurvey() ?
                  <Button variant="text" startIcon={<CalendarMonth />} onClick={() => { setSurveyDialog(true) }}>Update Your Availability</Button> :
                  <Button variant="text" startIcon={<CalendarMonth />} onClick={() => { setSurveyDialog(true) }}> Indicate Your Availability</Button>)}
            </Stack> */}
          <Box height={40} />
          <StudentViewList course={course} student={student} sectionsMap={sectionsMap} />

        </Grid>
        <Grid xs={2} />
      </Grid>
    </>
  );
}

export default CourseStudentView