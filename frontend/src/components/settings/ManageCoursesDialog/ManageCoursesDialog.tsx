import { Button, Dialog, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { CapitalizeFirstLetter } from "@util/shared/string";
import { Course } from "model/course";
import { FC } from "react"
import CourseListItem from "../CourseListItem";
import CourseAccessList from "./CourseAccessList";

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
                <Stack direction="row" display="flex" justifyContent="space-between">
                    {CapitalizeFirstLetter(term)} Courses
                    <Button>Upload</Button>
                </Stack>

            </DialogTitle>
            <DialogContent>
                {courses.length === 0 &&
                    <Typography textAlign="center">
                        No courses added for the semester yet.
                    </Typography>}
                {courses.map((course) => (
                    <CourseAccessList key={course.ID} course={course} />)
                )}
            </DialogContent>
        </Dialog>
}

export default ManageCoursesDialog