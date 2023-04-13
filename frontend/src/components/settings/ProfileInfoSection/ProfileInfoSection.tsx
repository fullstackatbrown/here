import React, { FC, useState } from "react";
import { Stack, TextField } from "@mui/material";
import Button from "@components/shared/Button";
import { useAuth } from "api/auth/hooks";
import { useForm } from "react-hook-form";
import AuthAPI from "api/auth/api";
import { toast } from "react-hot-toast";
import { handleBadRequestError } from "@util/errors";
import SettingsSection from "../SettingsSection/SettingsSection";

export interface ProfileInfoSectionProps {
}

type FormData = {
    displayName: string;
    pronouns: string;
    meetingLink: string;
};

const ProfileInfoSection: FC<ProfileInfoSectionProps> = ({ }) => {
    const [loading, setLoading] = useState(false);
    const { currentUser } = useAuth();
    const isTA = currentUser && Object.keys(currentUser.permissions).length > 0;

    const { register, handleSubmit, formState: { } } = useForm<FormData>();
    const onSubmit = handleSubmit(data => {
        setLoading(true);
        toast.promise(AuthAPI.updateUser(data.displayName, data.pronouns, data.meetingLink), {
            loading: "Updating user profile...",
            success: "User profile updated",
            error: (err) => handleBadRequestError(err),
        })
            .then(() => {
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    });

    return <SettingsSection title="Your profile">
        <form onSubmit={onSubmit}>
            <Stack spacing={3} mt={4}>
                <TextField size="small" label="Name" {...register("displayName")}
                    defaultValue={currentUser?.displayName}
                    required />
                <TextField size="small" label="Email" disabled value={currentUser?.email} />
                <TextField size="small" label="Pronouns" {...register("pronouns")}
                    defaultValue={currentUser?.pronouns} />
                <Stack direction="row" justifyContent="end">
                    <Button variant="contained" type="submit" loading={loading}>
                        Save
                    </Button>
                </Stack>
            </Stack>
        </form>
    </SettingsSection>;
};

export default ProfileInfoSection;


