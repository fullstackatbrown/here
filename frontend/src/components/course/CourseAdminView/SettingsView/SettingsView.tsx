import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { handleBadRequestError } from "@util/errors";
import CourseAPI from "api/course/api";
import { Course } from "model/course";
import toast from "react-hot-toast";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ClipboardJS from 'clipboard';
import { useEffect, useRef } from "react";
import AccessList from "@components/shared/AccessList/AccessList";
import { useCourseStaff } from "api/course/hooks";
import { CoursePermission } from "model/user";

export interface SettingsViewProps {
    course: Course;
}

export default function SettingsView({ course }: SettingsViewProps) {
    const copyButtonRef = useRef(null);
    const [staff, staffLoading] = useCourseStaff(course.ID, CoursePermission.CourseStaff);
    const [admin, adminLoading] = useCourseStaff(course.ID, CoursePermission.CourseAdmin);

    useEffect(() => {
        if (copyButtonRef.current) {
            new ClipboardJS(copyButtonRef.current, {
                text: () => course.entryCode,
            });
        }
    }, []);

    const changeAutoApproveRequests = () => {
        toast.promise(CourseAPI.updateCourse(course.ID, undefined, undefined, undefined, !course.autoApproveRequests),
            {
                loading: "Updating course...",
                success: "Course updated!",
                error: (err) => handleBadRequestError(err)
            })
            .catch(() => { })
    }

    return (
        <>
            <Stack direction="row" justifyContent="space-between" mb={1}>
                <Typography variant="h6" fontWeight={600}>
                    Settings
                </Typography>
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

                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} mb={2}>
                    <Stack direction="column" maxWidth="70%">
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

                    {admin && staff &&
                        <Stack spacing={0.5}>
                            <AccessList access={CoursePermission.CourseAdmin} users={admin} emails={[]} />
                            <AccessList course={course} access={CoursePermission.CourseStaff} users={staff} emails={[]} />
                        </Stack>}
                </Stack>
            </Stack >
        </>

    )

}


