import CourseActions from "@components/settings/CourseListItem/CourseActions";
import AccessList from "@components/shared/AccessList/AccessList";
import CourseStatusChip from "@components/shared/CourseStatusChip/CourseStatusChip";
import { useSnackbar } from "@components/shared/Snackbar/SnackbarProvider";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { handleBadRequestError } from "@util/errors";
import { useCourseInvites } from "api/auth/hooks";
import CourseAPI from "api/course/api";
import { useCourseStaff } from "api/course/hooks";
import ClipboardJS from 'clipboard';
import { Course, CourseStatus } from "model/course";
import { CoursePermission } from "model/user";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import AdminViewHeader from "../AdminViewHeader";

export interface SettingsViewProps {
    course: Course;
}

export default function SettingsView({ course }: SettingsViewProps) {
    const copyButtonRef = useRef(null);
    const router = useRouter();
    const [staff, staffLoading] = useCourseStaff(course, CoursePermission.CourseStaff);
    const [admin, adminLoading] = useCourseStaff(course, CoursePermission.CourseAdmin);
    const [adminInvites, adminInvitesLoading] = useCourseInvites(course.ID, CoursePermission.CourseAdmin);
    const [staffInvites, staffInvitesLoading] = useCourseInvites(course.ID, CoursePermission.CourseStaff);

    const loading = staffLoading || adminLoading || adminInvitesLoading || staffInvitesLoading;
    const isCourseActive = course.status === CourseStatus.CourseActive;
    const showSnackbar = useSnackbar();

    useEffect(() => {
        if (copyButtonRef.current) {
            new ClipboardJS(copyButtonRef.current, {
                text: () => course.entryCode,
            });
        }
    }, [course.entryCode]);

    const changeAutoApproveRequests = () => {
        toast.promise(CourseAPI.updateCourse(course.ID, undefined, !course.autoApproveRequests),
            {
                loading: "Updating course...",
                success: "Course updated!",
                error: (err) => handleBadRequestError(err)
            })
            .catch(() => { })
    }

    const showCopyToClipboardSnackbar = () => {
        showSnackbar({
            message: "Copied to clipboard",
            severity: "success",
        });
    }

    function handleAuthorizeGCal() {
        CourseAPI.authorizeGapi(course.ID, `${process.env.NEXT_PUBLIC_CLIENT_URL}/course/${course.ID}?view=settings`)
    }

    return (
        <>
            <AdminViewHeader view="settings" access={CoursePermission.CourseAdmin} />
            <Stack direction="column" spacing={4} my={2}>
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    alignItems={{ xs: "start", md: "center" }}
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
                            ref={copyButtonRef} onClick={showCopyToClipboardSnackbar}
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
                    direction={{ xs: "column", md: "row" }}
                    alignItems={{ xs: "start", md: "center" }}
                    justifyContent="space-between"
                    spacing={2}
                >
                    <Stack direction="column" maxWidth={{ md: "70%" }} spacing={0.5}>
                        <Typography fontWeight={500} whiteSpace="pre">
                            Auto-Approve Swap Requests:  {course.autoApproveRequests ? "ON" : "OFF"}
                        </Typography>
                        <Typography>
                            If this feature is turned on, swap requests will be automatically approved if the capacity is not reached.
                        </Typography>
                    </Stack>
                    <Button disabled={!isCourseActive} variant="outlined" onClick={() => changeAutoApproveRequests()}>
                        Turn {course.autoApproveRequests ? "Off" : "On"}
                    </Button>
                </Stack>
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    alignItems={{ xs: "start", md: "center" }}
                    justifyContent="space-between"
                    spacing={2}
                >
                    <Stack direction="column" maxWidth={{ md: "70%" }} spacing={0.5}>
                        <Typography fontWeight={500} whiteSpace="pre">
                            Test OAuth
                        </Typography>
                    </Stack>
                    <Button variant="outlined" onClick={handleAuthorizeGCal}>
                        Authorize
                    </Button>
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


