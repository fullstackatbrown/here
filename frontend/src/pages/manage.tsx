import AdminList from "@components/manage/AdminList/AdminList";
import AllCourses from "@components/manage/AllCourses/AllCourses";
import AppLayout from "@components/shared/AppLayout";
import { Stack } from "@mui/material";

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
