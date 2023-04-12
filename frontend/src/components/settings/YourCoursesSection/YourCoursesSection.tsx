import React, { FC } from "react";
import { List } from "@mui/material";
import { useCourses } from "api/course/hooks";
import { useSession } from "api/auth/hooks";
import { CoursePermission } from "api/auth/api";
import CourseListItem from "../CourseListItem";
import SettingsSection from "@components/settings/SettingsSection";

export interface YourCoursesSectionProps {
}

/**
 * Lists courses in which you've been granted admin privileges.
 */
const YourCoursesSection: FC<YourCoursesSectionProps> = ({ }) => {
    const { currentUser, loading } = useSession();
    const [courses, loadingCourses] = useCourses();
    const filteredCourses = courses && courses.filter(course => currentUser?.permissions && (currentUser.permissions[course.ID] === CoursePermission.CourseAdmin));

    return <SettingsSection taOnly title="Manage your courses" loading={loading || loadingCourses}>
        {filteredCourses && <List>
            {filteredCourses.map((course, index) => <CourseListItem key={course.ID} course={course}
                isLastChild={index === (filteredCourses.length - 1)} />)}
        </List>}
    </SettingsSection>;
};

export default YourCoursesSection;


