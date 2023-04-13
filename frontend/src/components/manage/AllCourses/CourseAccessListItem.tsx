import { Box, Chip, Stack, Tooltip, Typography } from "@mui/material";
import { handleBadRequestError } from "@util/errors";
import { capitalizeFirstLetter } from "@util/shared/string";
import CourseAPI from "api/course/api";
import { Course } from "model/course";
import { CoursePermission, User } from "model/user";
import { FC, useState } from "react";
import toast from "react-hot-toast";
import AddAccessButton from "./AddAccessButton";

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
            <Box mt={0.5} width={50}>
                <Typography color="secondary" fontSize={14}>{capitalizeFirstLetter(access)}</Typography>
            </Box>
            <Box display="flex" flexWrap="wrap" flexDirection="row" alignItems="center">
                {users.length === 0 ?
                    <Typography mx={0.5} color="text.secondary" fontSize={14}>No {access.toLowerCase()} added yet</Typography> :
                    users.map((user) => (
                        <Tooltip title={user.email} placement="right" sx={{ marginRight: 0.5 }}>
                            <Chip
                                label={user.displayName}
                                size="small"
                                onDelete={() => handleRevokeUserAccess(user)}
                            />
                        </Tooltip>
                    ))
                }
                <AddAccessButton course={course} access={access} />
            </Box>
        </Stack>
    )
}

export default CourseAccessListItem