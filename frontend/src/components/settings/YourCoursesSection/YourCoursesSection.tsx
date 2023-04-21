import React, { FC } from "react";
import { List } from "@mui/material";
import { useCourses, useCoursesByIDs } from "api/course/hooks";
import { useSession } from "api/auth/hooks";
import CourseListItem from "../CourseListItem";
import { CoursePermission } from "model/user";
import { sortCoursesByTerm } from "@util/shared/terms";
import SettingsSection from "../SettingsSection/SettingsSection";

export interface YourCoursesSectionProps {
}

/**
 * Lists courses in which you've been granted admin privileges.
 */
const YourCoursesSection: FC<YourCoursesSectionProps> = ({ }) => {
    const { currentUser, loading } = useSession();
    const myCourses = currentUser?.permissions && Object.keys(currentUser.permissions).filter(courseID => currentUser.permissions[courseID] === CoursePermission.CourseAdmin)
    const [courses, loadingCourses] = useCoursesByIDs(myCourses);

    return <SettingsSection taOnly title="Manage your courses" loading={loading || loadingCourses}>
        {courses &&
            <List>
                {sortCoursesByTerm(courses).map((course, index) =>
                    <CourseListItem key={course.ID} course={course} />)}
            </List>}
    </SettingsSection>;
};

export default YourCoursesSection;


