import { CoursePermission } from "model/user";
import CourseAdminViewNavigation from "../CourseAdminViewNavigation";
import { DesktopSidebar } from "../DesktopSidebar";

interface DesktopNavigationProps {
    access: CoursePermission;
    headerInView?: boolean;
    courseCode: string;
}

export default function DesktopNavigation({
    access,
    headerInView,
    courseCode,
}: DesktopNavigationProps) {

    return (
        <DesktopSidebar headerInView={headerInView} courseCode={courseCode}>
            <CourseAdminViewNavigation access={access} />
        </DesktopSidebar>
    );
}
