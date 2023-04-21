import { Button } from "@mui/material";
import { Course } from "model/course";
import { FC } from "react";
import StudentViewHeader from "../StudentViewHeader";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AuthAPI from "api/auth/api";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { handleBadRequestError } from "@util/errors";

export interface StudentSettingsViewProps {
    course: Course;
}

const StudentSettingsView: FC<StudentSettingsViewProps> = ({ course }) => {
    const router = useRouter();

    const quitCourse = () => {
        const confirmed = confirm("Are you sure you want to quit this course? You will no longer be able to access this course.");
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
            <StudentViewHeader view="settings" />
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
