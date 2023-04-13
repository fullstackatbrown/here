import React from "react";
import { Stack } from "@mui/material";
import AppLayout from "@components/shared/AppLayout";
import YourCoursesSection from "@components/settings/YourCoursesSection";
import AllCoursesSection from "@components/settings/AllCoursesSection";
import ProfileInfoSection from "@components/settings/ProfileInfoSection";
import AllCourses from "@components/manage/AllCourses/AllCourses";
import AdminList from "@components/manage/AdminList/AdminList";

export default function Manage() {
    return (
        <AppLayout maxWidth="md">
            <Stack spacing={5} mt={15}>
                <AllCourses />
                <AdminList />
            </Stack>
        </AppLayout>
    );
}
