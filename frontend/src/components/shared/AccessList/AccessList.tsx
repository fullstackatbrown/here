import { Box, Chip, Stack, Tooltip, Typography } from "@mui/material";
import { handleBadRequestError } from "@util/errors";
import { capitalizeFirstLetter } from "@util/shared/string";
import CourseAPI from "api/course/api";
import { Course } from "model/course";
import { CoursePermission, User } from "model/user";
import { FC } from "react";
import toast from "react-hot-toast";
import AddAccessButton from "./AddAccessButton";

interface AccessListProps {
    course?: Course; // if course is passed in, the list is editable
    access: CoursePermission;
    users: User[];
    emails: string[];
}

interface UserData {
    user?: User;
    email?: string;
}

const AccessList: FC<AccessListProps> = ({ course, access, users, emails }) => {

    const editable = course !== undefined;
    const data: UserData[] = users && emails && users.map((user) => ({ user } as UserData)).concat(emails.map((email) => ({ email } as UserData)))

    const handleRevokeUserAccess = (user: User) => {
        return () => {
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
    }

    return (
        <Stack direction="row" alignItems="start">
            <Box width={60} mt={0.5}>
                <Typography color="secondary" fontSize={14}>{capitalizeFirstLetter(access)}</Typography>
            </Box>
            {data && <Box display="flex" flexWrap="wrap" flexDirection="row" alignItems="center">
                {data.length === 0 ?
                    <Typography mx={0.5} my={0.5} color="text.secondary" fontSize={14}>No {access.toLowerCase()} added yet</Typography> :
                    data.map((data) => {
                        if (data.user) {
                            return <Tooltip title={data.user.email} placement="right">
                                <Chip
                                    sx={{ height: 26, marginRight: 0.5 }}
                                    label={data.user.displayName}
                                    size="small"
                                    onDelete={editable && handleRevokeUserAccess(data.user)}
                                />
                            </Tooltip>
                        } else {
                            return <Tooltip title={data.email} placement="right">
                                <Chip
                                    sx={{ height: 26, marginRight: 0.5 }}
                                    label={data.email}
                                    size="small"
                                />
                            </Tooltip>

                        }
                    })
                }
                {editable && <AddAccessButton {...{ course, access }} />}
            </Box>}
        </Stack>
    )
}

export default AccessList