import GoogleIcon from "@mui/icons-material/Google";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { Errors } from "@util/errors";
import AuthAPI from "api/auth/api";
import { toast } from "react-hot-toast";

export default function Login() {
    function handleSignIn() {
        AuthAPI.signInWithGoogle()
            .then(() => (window.location.href = "/"))
            .catch((err) => {
                if (err.code === 'auth/popup-blocked') {
                    toast.error(Errors.POPUP_BLOCKED)
                } else {
                    toast.error(Errors.UNKNOWN)
                }
            });
    }

    return (
        <Container maxWidth="sm" sx={{ marginTop: [8, null, 12] }}>
            <Paper variant="outlined">
                <Box p={4} textAlign="center">
                    <Typography variant="h4" fontWeight={500}>
                        Welcome to Here
                    </Typography>
                    <Typography variant="h6">
                        Use your Brown email to continue.
                    </Typography>

                    <Box mt={2}>
                        <Button
                            size="large"
                            startIcon={<GoogleIcon />}
                            variant="contained"
                            onClick={handleSignIn}
                        >
                            Sign in with Google
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}
