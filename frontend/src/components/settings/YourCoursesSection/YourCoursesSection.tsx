import React, { FC } from "react";
import { List } from "@mui/material";
import { useCourses } from "api/course/hooks";
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
    const [courses, loadingCourses] = useCourses();
    const filteredCourses = courses && courses.filter(course => currentUser?.permissions && (currentUser.permissions[course.ID] === CoursePermission.CourseAdmin));


    // TODO: sort by terms
    return <SettingsSection taOnly title="Manage your courses" loading={loading || loadingCourses}>
        {filteredCourses &&
            <List>
                {sortCoursesByTerm(filteredCourses).map((course, index) =>
                    <CourseListItem key={course.ID} course={course} />)}
            </List>}
    </SettingsSection>;
};

export default YourCoursesSection;


