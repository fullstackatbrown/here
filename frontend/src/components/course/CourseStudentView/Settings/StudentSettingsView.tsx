import { Button } from "@mui/material";
import { Course } from "model/course";
import { FC } from "react";
import StudentViewHeader from "../StudentViewHeader";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AuthAPI from "api/auth/api";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { handleBadRequestError } from "@util/errors";
import { useDialog } from "@components/shared/ConfirmDialog/ConfirmDialogProvider";

export interface StudentSettingsViewProps {
    course: Course;
}

const StudentSettingsView: FC<StudentSettingsViewProps> = ({ course }) => {
    const router = useRouter();
    const showDialog = useDialog();

    const quitCourse = async () => {
        const confirmed = await showDialog({
            title: "Quit Course",
            message: "Are you sure you want to quit this course? You will no longer be able to access this course.",
        });
        if (confirmed) {
            AuthAPI.quitCourse(course.ID)
                .then(() => {
                    router.push("/").then(() => toast.success(`Successfully quit from ${course.code}`));
                })
                .catch((err) => {
                    toast.error(handleBadRequestError(err))
                });
        }
    };

    return (
        <>
            <StudentViewHeader course={course} view="settings" />
            <Button
                variant="outlined"
                startIcon={<ExitToAppIcon />}
                onClick={() => quitCourse()}
            >
                Quit Course
            </Button>

        </>
    );
};

export default StudentSettingsView;
