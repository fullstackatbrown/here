import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Box, Dialog, DialogContent, IconButton, Stack, Theme, Tooltip, Typography, tooltipClasses, useMediaQuery } from "@mui/material";
import formatSectionInfo from "@util/shared/section";
import { Assignment } from "model/assignment";
import { Course } from "model/course";
import { Section } from "model/section";
import { Survey } from "model/survey";
import { User } from "model/user";
import { FC, useState } from "react";
import StudentViewHeader from "../StudentViewHeader";
import StudentGradesTable from "./StudentGradesTable";

export interface StudentHomeViewProps {
    course: Course;
    student: User;
    surveys: Survey[];
    sectionsMap: Record<string, Section>;
    assignmentsMap: Record<string, Assignment>;
}

const StudentHomeView: FC<StudentHomeViewProps> = ({ course, student, sectionsMap, assignmentsMap }) => {
    const [allSurveysDialog, setAllSurveysDialog] = useState(false)
    const [tooltip, setTooltip] = useState(false)
    const isXsScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const getAssignedSection = () => {
        const defaultSection = student.defaultSections?.[course.ID]
        if (defaultSection && defaultSection !== "" && sectionsMap) {
            const section = sectionsMap[defaultSection] as Section
            return formatSectionInfo(section, true)
        }
        return undefined
    }



    return (
        <>
            <Dialog
                open={tooltip}
                onClose={() => { setTooltip(false) }}
                maxWidth="sm" fullWidth
            >
                <DialogContent>
                    This is the default section you will attend if you have not requested a swap for a particular assignment.
                </DialogContent>
            </Dialog>

            <StudentViewHeader course={course} view="home" display={isXsScreen ? "block" : "none"} />
            <Stack direction="column" spacing={5}>
                <Stack direction="row" flexWrap="wrap" alignItems="center" spacing={1} mt={{ xs: 0, md: 1.5 }}>
                    <Typography fontSize={17} variant="button" fontWeight={600}>
                        Regular Section:
                    </Typography>
                    <Typography fontSize={17} variant="button" fontWeight={400}>
                        {getAssignedSection() || "Unassigned"}
                    </Typography>
                    <Tooltip
                        title="This is the default section you will attend if you have not requested a swap for a particular assignment."
                        placement="right"
                        PopperProps={{
                            sx: {
                                "& .MuiTooltip-tooltip": {
                                    fontSize: 13,
                                    maxWidth: 400,
                                }
                            }
                        }}
                        disableTouchListener={isXsScreen}
                        disableHoverListener={isXsScreen}
                        disableFocusListener={isXsScreen}
                    >
                        <IconButton
                            sx={{ p: 0.5 }}
                            onClick={() => { isXsScreen && setTooltip(true) }}
                        >
                            <HelpOutlineIcon fontSize="small" color="secondary" />
                        </IconButton>
                    </Tooltip>
                </Stack>

                <Box>
                    <Typography variant="h6" fontWeight={600} fontSize={{ xs: 17, md: 20 }}>
                        Assignments
                    </Typography>
                    {(Object.keys(assignmentsMap)?.length > 0) ?
                        <StudentGradesTable {...{ course, student, sectionsMap }} assignments={Object.values(assignmentsMap)} /> :
                        <Typography mt={1}>Your instructor has not released any assignments yet</Typography>}
                </Box>

            </Stack >
        </>
    );
};

export default StudentHomeView;
