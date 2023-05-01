import { Divider, Grid, Paper, Stack, Typography } from "@mui/material";
import { User } from "model/user";
import { FC } from "react";

export interface ProfileInfoSectionProps {
    user: User;
}

const ProfileInfoSection: FC<ProfileInfoSectionProps> = ({ user }) => {

    return <Paper variant="outlined">
        <Stack p={3} spacing={3}>
            <Typography variant="h6" fontWeight={600}>Profile</Typography>
            <Stack spacing={3} ml={0.3}>
                <Grid container display="flex" alignItems="center">
                    <Grid item xs={1.5}>
                        <Typography fontSize={14} color="secondary">
                            Name
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography>
                            {user?.displayName}
                        </Typography>
                    </Grid>
                </Grid>
                <Divider />
                <Grid container display="flex" alignItems="center">
                    <Grid item xs={1.5}>
                        <Typography fontSize={14} color="secondary">
                            Email
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography>
                            {user?.email}
                        </Typography>
                    </Grid>
                </Grid>
            </Stack>
        </Stack>
    </Paper>;
};

export default ProfileInfoSection;


