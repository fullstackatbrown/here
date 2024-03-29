import CourseActions from "@components/settings/CourseListItem/CourseActions";
import AccessList from "@components/shared/AccessList/AccessList";
import CourseStatusChip from "@components/shared/CourseStatusChip/CourseStatusChip";
import ViewHeader from "@components/shared/ViewHeader/ViewHeader";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Box, Button, CircularProgress, Stack, Switch, Typography } from "@mui/material";
import { handleBadRequestError } from "@util/errors";
import { useCourseInvites } from "api/auth/hooks";
import CourseAPI from "api/course/api";
import { useCourseStaff } from "api/course/hooks";
import ClipboardJS from 'clipboard';
import { Course, CourseConfig, CourseStatus } from "model/course";
import { CoursePermission } from "model/user";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

export interface SettingsViewProps {
    course: Course;
}

export default function SettingsView({ course }: SettingsViewProps) {
    const copyButtonRef = useRef(null);
    const [staff, staffLoading] = useCourseStaff(course, CoursePermission.CourseStaff);
    const [admin, adminLoading] = useCourseStaff(course, CoursePermission.CourseAdmin);
    const [adminInvites, adminInvitesLoading] = useCourseInvites(course.ID, CoursePermission.CourseAdmin);
    const [staffInvites, staffInvitesLoading] = useCourseInvites(course.ID, CoursePermission.CourseStaff);

    const loading = staffLoading || adminLoading || adminInvitesLoading || staffInvitesLoading;
    const isCourseActive = course.status === CourseStatus.CourseActive;

    useEffect(() => {
        if (copyButtonRef.current) {
            new ClipboardJS(copyButtonRef.current, {
                text: () => course.entryCode,
            });
        }
    }, [course.entryCode]);

    const changeCourseConfig = (config: CourseConfig) => {
        toast.promise(CourseAPI.updateCourse(course.ID, undefined, config),
            {
                loading: "Updating course...",
                success: "Course updated!",
                error: (err) => handleBadRequestError(err)
            })
            .catch(() => { })
    }

    return (
        <>
            <ViewHeader course={course} view="settings" access={CoursePermission.CourseAdmin} />
            <Stack direction="column" spacing={4} my={2}>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={2}
                >
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography fontWeight={500}>
                            Course Status:
                        </Typography>
                        <CourseStatusChip status={course.status} size="medium" />
                    </Stack>
                    <CourseActions course={course} />
                </Stack>

                <Stack direction="column">
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Typography fontWeight={500}>
                            Course Entry Code:
                        </Typography>
                        <Button
                            color="inherit" sx={{ paddingTop: 0, paddingBottom: 0, fontSize: 16 }}
                            ref={copyButtonRef} onClick={() => { toast.success("Copied to clipboard") }}
                        >
                            {course.entryCode}
                            <ContentCopyIcon
                                style={{ fontSize: 13, marginLeft: 5 }}
                            />
                        </Button>
                    </Stack>
                    <Typography>
                        Students can join this course on Here using this code.
                    </Typography>
                </Stack>

                <Stack
                    direction="row"
                    alignItems={{ xs: "start", md: "center" }}
                    justifyContent="space-between"
                    spacing={2}
                >
                    <Stack direction="column" maxWidth={{ md: "70%", xs: "85%" }} spacing={0.5}>
                        <Typography fontWeight={500} whiteSpace="pre">
                            Auto-Approve Swap Requests
                        </Typography>
                        <Typography>
                            If this feature is turned on, swap requests will be automatically approved if the capacity is not reached.
                        </Typography>
                    </Stack>
                    <Switch
                        disabled={!isCourseActive}
                        checked={course.config.autoApproveRequests}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            changeCourseConfig({ ...course.config, autoApproveRequests: event.target.checked });
                        }}
                    />

                </Stack>
                <Stack
                    direction="row"
                    alignItems={{ xs: "start", md: "center" }}
                    justifyContent="space-between"
                    spacing={2}
                >
                    <Stack direction="column" maxWidth={{ md: "70%", xs: "85%" }} spacing={0.5}>
                        <Typography fontWeight={500}>
                            Share People List With Students
                        </Typography>
                        <Typography>
                            If this feature is turned on, students will be able to see the list of other students enrolled in the course and their sections.
                        </Typography>
                    </Stack>
                    <Switch
                        disabled={!isCourseActive}
                        checked={course.config.sharePeopleListWithStudents}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            changeCourseConfig({ ...course.config, sharePeopleListWithStudents: event.target.checked });
                        }}
                    />
                </Stack>

                <Stack direction="column" spacing={1.5}>
                    <Typography fontWeight={500}>
                        Admin & Staff
                    </Typography>

                    {loading ?
                        <Box my={1}>
                            <CircularProgress />
                        </Box> :
                        <Stack spacing={0.5}>
                            <AccessList access={CoursePermission.CourseAdmin} users={admin} emails={adminInvites} />
                            <AccessList course={course} access={CoursePermission.CourseStaff} users={staff} emails={staffInvites} />
                        </Stack>}
                </Stack>
            </Stack >
        </>

    )

}


