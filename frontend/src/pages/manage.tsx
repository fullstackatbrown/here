import AdminList from "@components/manage/AdminList/AdminList";
import AllCourses from "@components/manage/AllCourses/AllCourses";
import AppLayout from "@components/shared/AppLayout";
import { Stack, Typography } from "@mui/material";
import { useSession } from "api/auth/hooks";

export default function Manage() {
    const { currentUser, loading } = useSession();

    return (
        <AppLayout maxWidth="md" loading={loading}>
            <Stack spacing={5} mt={15}>
                {currentUser &&
                    (currentUser?.isAdmin ?
                        <>
                            <AllCourses />
                            <AdminList />
                        </> :
                        <Typography textAlign="center" variant="h6">Sorry, you don't have the permissions to access this page.</Typography>
                    )}
            </Stack>
        </AppLayout>
    );
}
