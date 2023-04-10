import { FC } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Stack,
    Typography
} from "@mui/material";

export interface AboutDialogProps {
    open: boolean;
    onClose: () => void;
}

const AboutDialog: FC<AboutDialogProps> = ({ open, onClose }) => {
    return <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>About Here</DialogTitle>
        <DialogContent>
            <Stack spacing={2.5} my={1}>
                <Typography>
                    Here is a web app created to streamline the lab management process for CS classes at Brown University.
                </Typography>
                {/*<Button startIcon={<GitHubIcon/>} color="inherit" variant="outlined"*/}
                {/*        href="https://github.com/nthnluu/hours-frontend/wiki/Contributing">*/}
                {/*    Contribute*/}
                {/*</Button>*/}
            </Stack>
        </DialogContent>
    </Dialog>;
};

export default AboutDialog;


