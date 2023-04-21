import SurveyDialog from "@components/course/CourseAdminView/SectionsView/AvailabilitySurvey/SurveyDialog";
import ViewHeader from "@components/shared/ViewHeader/ViewHeader";
import { CalendarMonth } from "@mui/icons-material";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Box, Button, Dialog, DialogContent, IconButton, Stack, Theme, Tooltip, Typography, useMediaQuery } from "@mui/material";
import formatSectionInfo from "@util/shared/formatSectionInfo";
import { Assignment } from "model/assignment";
import { Course } from "model/course";
import { Section } from "model/section";
import { Survey } from "model/survey";
import { CoursePermission, User } from "model/user";
import { FC, useState } from "react";
import StudentGradesTable from "./StudentGradesTable";
import StudentViewHeader from "../StudentViewHeader";

export interface StudentHomeViewProps {
    course: Course;
    student: User;
    survey: Survey;
    sectionsMap: Record<string, Section>;
    assignmentsMap: Record<string, Assignment>;
}

const StudentHomeView: FC<StudentHomeViewProps> = ({ course, student, survey, sectionsMap, assignmentsMap }) => {
    const [surveyDialog, setSurveyDialog] = useState(false)
    const [tooltip, setTooltip] = useState(false)
    const isXsScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const getAssignedSection = () => {
        const defaultSection = student.defaultSection?.[course.ID]
        if (defaultSection && defaultSection !== "" && sectionsMap) {
            const section = sectionsMap[defaultSection] as Section
            return formatSectionInfo(section)
        }
        return undefined
    }

    const courseHasSurvey = () => survey?.published && survey?.endTime > new Date().toISOString()

    const studentHasFilledOutSurvey = () => survey?.responses && survey?.responses?.[student.ID] !== undefined

    return (
        <>
            {survey &&
                <SurveyDialog
                    open={surveyDialog}
                    onClose={() => { setSurveyDialog(false) }}
                    survey={survey}
                    studentID={student.ID}
                />}
            <Dialog
                open={tooltip && isXsScreen}
                onClose={() => { setTooltip(false) }}
                maxWidth="sm" fullWidth
            >
                <DialogContent>
                    This is the default section you will attend if you have not requested a swap for a particular assignment.
                </DialogContent>
            </Dialog>

            <StudentViewHeader view="home" display={isXsScreen ? "block" : "none"} />
            <Stack direction="column" spacing={5}>
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    alignItems={{ xs: "flex-start", md: "center" }}
                    spacing={1}
                    justifyContent="space-between"
                    mt={{ xs: 0, md: 1.5 }}
                >
                    <Stack direction="row" flexWrap="wrap" alignItems="center" spacing={1}>
                        <Typography fontSize={17}>
                            Regular Section:
                        </Typography>
                        <Typography fontSize={17}>
                            {getAssignedSection() || "Unassigned"}
                        </Typography>
                        <Tooltip
                            title="This is the default section you will attend if you have not requested a swap for a particular assignment."
                            placement="right"
                            open={!isXsScreen && tooltip}
                        >
                            <IconButton
                                sx={{ p: 0.5 }}
                                onClick={() => { isXsScreen && setTooltip(true) }}
                                onMouseEnter={() => { setTooltip(true) }}
                                onMouseLeave={() => { setTooltip(false) }}
                            >
                                <HelpOutlineIcon fontSize="small" color="secondary" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                    {courseHasSurvey() &&
                        <Button variant={isXsScreen ? "outlined" : "text"} startIcon={<CalendarMonth />} onClick={() => { setSurveyDialog(true) }}>
                            {studentHasFilledOutSurvey() ? "Update Survey Response" : "Fill Out Survey"}
                        </Button>
                    }
                </Stack>

                <Box>
                    <Typography variant="h6" fontWeight={600} fontSize={{ xs: 17, md: 20 }}>
                        Assignments
                    </Typography>
                    {(Object.keys(assignmentsMap)?.length > 0) ?
                        <StudentGradesTable {...{ course, student, sectionsMap, assignmentsMap }} /> :
                        <Typography mt={1}>Your instructor has not released any assignments yet</Typography>}
                </Box>

            </Stack>
        </>
    );
};

export default StudentHomeView;
