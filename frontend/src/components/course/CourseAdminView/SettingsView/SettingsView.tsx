import AccessList from "@components/shared/AccessList/AccessList";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Button, Stack, Typography } from "@mui/material";
import { handleBadRequestError } from "@util/errors";
import { useCourseInvites } from "api/auth/hooks";
import CourseAPI from "api/course/api";
import { useCourseStaff } from "api/course/hooks";
import ClipboardJS from 'clipboard';
import { Course } from "model/course";
import { CoursePermission } from "model/user";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import ViewHeader from "../ViewHeader/ViewHeader";

export interface SettingsViewProps {
    course: Course;
}

export default function SettingsView({ course }: SettingsViewProps) {
    const copyButtonRef = useRef(null);
    const [staff, staffLoading] = useCourseStaff(course.ID, CoursePermission.CourseStaff);
    const [admin, adminLoading] = useCourseStaff(course.ID, CoursePermission.CourseAdmin);
    const [adminInvites, adminInvitesLoading] = useCourseInvites(course.ID, CoursePermission.CourseAdmin);
    const [staffInvites, staffInvitesLoading] = useCourseInvites(course.ID, CoursePermission.CourseStaff);

    const loading = staffLoading || adminLoading || adminInvitesLoading || staffInvitesLoading;

    useEffect(() => {
        if (copyButtonRef.current) {
            new ClipboardJS(copyButtonRef.current, {
                text: () => course.entryCode,
            });
        }
    }, []);

    const changeAutoApproveRequests = () => {
        toast.promise(CourseAPI.updateCourse(course.ID, undefined, !course.autoApproveRequests),
            {
                loading: "Updating course...",
                success: "Course updated!",
                error: (err) => handleBadRequestError(err)
            })
            .catch(() => { })
    }

    return (
        <>
            <Stack direction="row" justifyContent="space-between" mb={1} height={40}>
                <ViewHeader view="settings" views={["sections", "assignments", "people", "requests", "settings"]} access={CoursePermission.CourseAdmin} />
            </Stack>
            <Stack direction="column" spacing={4} my={2}>

                <Stack direction="column">
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Typography fontWeight={500}>
                            Course Entry Code:
                        </Typography>
                        <Button color="inherit" sx={{ paddingTop: 0, paddingBottom: 0, fontSize: 16 }} ref={copyButtonRef}>
                            {course.entryCode}
                            <ContentCopyIcon
                                style={{ fontSize: 13, marginLeft: 5 }} />
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
                    spacing={2} mb={2}
                >
                    <Stack direction="column" maxWidth={{ md: "70%" }}>
                        <Typography fontWeight={500}>
                            Auto-Approve Swap Requests: {course.autoApproveRequests ? "On" : "Off"}
                        </Typography>
                        <Typography>
                            If this feature is turned on, swap requests will be automatically approved if the capacity is not reached.
                        </Typography>
                    </Stack>
                    <Button variant="outlined" onClick={() => changeAutoApproveRequests()}>
                        Turn {course.autoApproveRequests ? "Off" : "On"}
                    </Button>
                </Stack>

                <Stack direction="column" spacing={1.5}>
                    <Typography fontWeight={500}>
                        Admin & Staff
                    </Typography>

                    {!loading &&
                        <Stack spacing={0.5}>
                            <AccessList access={CoursePermission.CourseAdmin} users={admin} emails={adminInvites} />
                            <AccessList course={course} access={CoursePermission.CourseStaff} users={staff} emails={staffInvites} />
                        </Stack>}
                </Stack>
            </Stack >
        </>

    )

}


