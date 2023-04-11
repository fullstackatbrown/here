import { Button, Stack, Typography } from "@mui/material";
import { handleBadRequestError } from "@util/errors";
import CourseAPI from "api/course/api";
import { Course } from "model/course";
import toast from "react-hot-toast";

export interface SettingsViewProps {
    course: Course;
}

export default function SettingsView({ course }: SettingsViewProps) {

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
            <Stack direction="column" spacing={3} my={2}>
                <Stack direction="column" maxWidth="70%">
                    <Typography fontSize={16} fontWeight={500}>
                        Course Entry Code: {course.entryCode}
                    </Typography>
                    <Typography>
                        Students can join this course on Here using this code.
                    </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} mb={2}>
                    <Stack direction="column" maxWidth="70%">
                        <Typography fontSize={16} fontWeight={500}>
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
            </Stack>
        </>

    )

}


