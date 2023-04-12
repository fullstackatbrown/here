import { Box, Chip, Stack, Typography } from "@mui/material";
import { handleBadRequestError } from "@util/errors";
import { CapitalizeFirstLetter } from "@util/shared/string";
import CourseAPI from "api/course/api";
import { Course } from "model/course";
import { CoursePermission, User } from "model/user";
import { FC } from "react";
import toast from "react-hot-toast";

interface CourseAccessListItemProps {
    course: Course;
    access: CoursePermission;
    users: User[];
}
const CourseAccessListItem: FC<CourseAccessListItemProps> = ({ course, access, users }) => {

    const handleRevokeUserAccess = (user: User) => {
        const confirmed = confirm(`Are you sure you want to revoke ${user.displayName}'s ${access.toLowerCase()} access?`);
        if (confirmed) {
            toast.promise(CourseAPI.revokePermission(course.ID, user.ID), {
                loading: "Revoking access...",
                success: "Access revoked!",
                error: (err) => handleBadRequestError(err),
            })
                .catch(() => { })
        }
    }

    return (
        <Stack direction="row" alignItems="start">
            <Box mt={0.3} width={50}>
                <Typography color="secondary" fontSize={14}>{CapitalizeFirstLetter(access)}</Typography>
            </Box>
            <Box>
                {users.map((user) => (
                    <Chip
                        label={user.displayName}
                        size="small"
                        onDelete={() => handleRevokeUserAccess(user)}
                    />
                ))}
                {users.length === 0 &&
                    <Typography ml={0.5} mt={0.3} color="text.secondary" fontSize={14}>No {access.toLowerCase()} added yet</Typography>
                }
            </Box>
        </Stack>
    )
}

export default CourseAccessListItem