import { FC } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Stack,
    Typography,
    Link
} from "@mui/material";

export interface AboutDialogProps {
    open: boolean;
    onClose: () => void;
}

const AboutDialog: FC<AboutDialogProps> = ({ open, onClose }) => {
    return <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>About Here</DialogTitle>
        <DialogContent>
            <Stack spacing={2.5} mb={1}>
                <Typography>
                    Here is a web app created to streamline lab/section management for classes at Brown University.
                    We hope this improves your experience and please&nbsp;
                    <Link href="https://forms.gle/xmLQjz8Psae73Pbp8" underline="hover" target="_blank">
                        let us know
                    </Link>
                    &nbsp;how we can improve!
                </Typography>
                <Typography variant="body2">
                    By: Jenny Yu, Hammad Izhar, Nathan Andrews, Dylan Hu, James Hu, Allen Wang
                </Typography>
            </Stack>
        </DialogContent>
    </Dialog>;
};

export default AboutDialog;


