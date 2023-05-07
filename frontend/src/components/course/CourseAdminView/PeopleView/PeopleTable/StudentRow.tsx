import { useDialog } from "@components/shared/ConfirmDialog/ConfirmDialogProvider";
import styled from "@emotion/styled";
import ClearIcon from '@mui/icons-material/Clear';
import { Box, Grid, IconButton, Tooltip, Typography, useTheme } from "@mui/material";
import { handleBadRequestError } from "@util/errors";
import formatSectionInfo from "@util/shared/section";
import CourseAPI from "api/course/api";
import { CourseUserData } from "model/course";
import { Section } from "model/section";
import { FC } from "react";
import toast from "react-hot-toast";

export interface EnrolledStudentRowProps {
    student: CourseUserData;
    courseID: string;
    isCourseActive: boolean;
    isXsScreen: boolean;
    sectionsMap: Record<string, Section>;
    setSelectedStudent: (studentID: string) => void;
}

export interface InvitedStudentRowProps {
    email: string;
    courseID: string;
    isCourseActive: boolean;
    isXsScreen: boolean;
}

const GridItem = styled(Grid)(({ theme }) => ({
    display: "flex",
    alignItems: "center"
}))

const TableCell = styled(Typography)(({ theme }) => ({
    fontSize: 14
}))

export const EnrolledStudentRow: FC<EnrolledStudentRowProps> = ({ student, courseID, isCourseActive, isXsScreen, sectionsMap, setSelectedStudent }) => {
    const theme = useTheme();
    const showDialog = useDialog();

    const handleRemoveStudent = (student: CourseUserData) => {
        return async (e: React.MouseEvent<HTMLElement>) => {
            e.stopPropagation();
            const confirmed = await showDialog({
                title: 'Remove Student',
                message: `Are you sure you want to remove ${student.displayName} from this course?`,
            });
            if (confirmed) {
                toast.promise(CourseAPI.deleteStudent(courseID, student.studentID), {
                    loading: "Removing student...",
                    success: "Student removed",
                    error: (err) => handleBadRequestError(err),
                })
                    .catch(() => { })
            }
        }
    }
    return <Box
        sx={{ "&:hover": { backgroundColor: theme.palette.action.hover } }}
        onClick={() => { setSelectedStudent(student.studentID) }}
    >
        <Grid container py={1.8}>
            <GridItem item xs={10.8} md={11.5}>
                <Grid container>
                    <GridItem item xs={12} md={3.5}>
                        <Typography fontSize={isXsScreen ? 15 : 14} fontWeight={isXsScreen ? 500 : 400}>
                            {student.displayName}
                        </Typography>
                    </GridItem>
                    <GridItem item xs={12} md={4.2}>
                        <TableCell>{student.email}</TableCell>
                    </GridItem>
                    <GridItem item xs={12} md={4.3}>
                        <TableCell>{student.defaultSection ? formatSectionInfo(sectionsMap[student.defaultSection], true) : "Unassigned"}</TableCell>
                    </GridItem>
                </Grid>
            </GridItem>
            <GridItem item xs={1.2} md={0.5}>
                <Tooltip title="Remove from course" placement="right" disableTouchListener>
                    <IconButton onClick={handleRemoveStudent(student)} size={"small"} disabled={!isCourseActive}>
                        <ClearIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </GridItem>
        </Grid>
    </Box>
}

export const InvitedStudentRow: FC<InvitedStudentRowProps> = ({ email, courseID, isCourseActive, isXsScreen }) => {
    const showDialog = useDialog();

    const handleRemoveInvite = (email: string) => {
        return async (e: React.MouseEvent<HTMLElement>) => {
            e.stopPropagation();
            const confirmed = await showDialog({
                title: 'Remove Student',
                message: `Are you sure you want to remove ${email} from this course?`,
            });
            if (confirmed) {
                toast.promise(CourseAPI.deleteStudent(courseID, undefined, email), {
                    loading: "Removing student...",
                    success: "Student removed",
                    error: (err) => handleBadRequestError(err),
                })
                    .catch(() => { })
            }
        }
    }

    return <Tooltip title="Waiting for student to log in" placement="right">
        <Grid container py={1.8}>
            <GridItem item xs={10.8} md={11.5}>
                <Grid container>
                    <GridItem item xs={12} md={3.5}>
                        <Typography fontSize={isXsScreen ? 15 : 14} fontWeight={isXsScreen ? 500 : 400}>
                            Pending
                        </Typography>
                    </GridItem>
                    <GridItem item xs={12} md={4.2}>
                        <TableCell>{email}</TableCell>
                    </GridItem>
                    <GridItem item xs={12} md={4.3}>
                        {!isXsScreen && <TableCell>/</TableCell>}
                    </GridItem>
                </Grid>
            </GridItem>
            <GridItem item xs={1.2} md={0.5}>
                <Tooltip title="Remove from course" placement="right" disableTouchListener>
                    <IconButton onClick={handleRemoveInvite(email)} size={"small"} disabled={!isCourseActive}>
                        <ClearIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </GridItem>
        </Grid>
    </Tooltip>
}
