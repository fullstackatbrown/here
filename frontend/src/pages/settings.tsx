import React from "react";
import { Stack } from "@mui/material";
import AppLayout from "@components/shared/AppLayout";
import YourCoursesSection from "@components/settings/YourCoursesSection";
import ProfileInfoSection from "@components/settings/ProfileInfoSection";

export default function Settings() {
    return (
        <AppLayout maxWidth="md">
            <Stack spacing={4} mt={4}>
                <ProfileInfoSection />
                <YourCoursesSection />
            </Stack>
        </AppLayout>
    );
}
