import { CoursePermission } from "model/user";
import { useState } from "react";
import { MobileSidebar } from "../MobileSidebar";
import CourseAdminViewNavigation from "../CourseAdminViewNavigation";

interface MobileNavigationProps {
    access: CoursePermission;
    headerInView: boolean;
    courseCode: string;
}

export default function MobileNavigation({
    access, headerInView, courseCode,
}: MobileNavigationProps) {
    const [open, toggleOpen] = useState(false);
    return (
        <>
            <MobileSidebar
                open={open}
                openDrawer={() => toggleOpen(true)}
                closeDrawer={() => toggleOpen(false)}
                headerInView={headerInView}
                courseCode={courseCode}
            >
                <CourseAdminViewNavigation access={access} />
            </MobileSidebar>
        </>
    );
}
