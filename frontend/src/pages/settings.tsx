import React from "react";
import { Stack } from "@mui/material";
import AppLayout from "@components/shared/AppLayout";
import { useAuth } from "api/auth/hooks";
import ProfileInfoSection from "@components/settings/ProfileInfoSection/ProfileInfoSection";
import YourCoursesSection from "@components/settings/YourCoursesSection/YourCoursesSection";

export default function Settings() {
    const { currentUser } = useAuth()

    return (
        <AppLayout maxWidth="md">
            <Stack spacing={4} mt={4}>
                <ProfileInfoSection user={currentUser} />
                <YourCoursesSection user={currentUser} />
            </Stack>
        </AppLayout>
    );
}
