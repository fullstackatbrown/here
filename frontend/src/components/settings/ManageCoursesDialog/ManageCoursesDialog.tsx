import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { CapitalizeFirstLetter } from "@util/shared/string";
import { Course } from "model/course";
import { FC } from "react"
import CourseListItem from "../CourseListItem";

interface ManageCoursesDialogProps {
    open: boolean;
    onClose: () => void;
    term: string;
    courses: Course[];
}
const ManageCoursesDialog: FC<ManageCoursesDialogProps> = ({ term, courses, open, onClose }) => {
    return term && courses &&
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>
                {CapitalizeFirstLetter(term)} Courses
            </DialogTitle>
            <DialogContent>
                {courses.map((course) => (
                    <CourseListItem course={course} />)
                )}
            </DialogContent>
        </Dialog>
}

export default ManageCoursesDialog