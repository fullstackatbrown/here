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
                    Here is a web app created to improve your experience signing up and getting checked off for labs at Brown University.
                    We are still in beta mode and would greatly appreciate any feedback you have.
                    Please&nbsp;
                    <Link href="https://forms.gle/VM4rjFnEHqddjRc28" underline="hover" target="_blank">
                        let us know
                    </Link>
                    &nbsp;how we can improve!
                </Typography>
                <Typography variant="body2">
                    Contributers: Jenny Yu, Hammad Izhar, Tianren Dong, Nathan Andrews, Dylan Hu, James Hu, Allen Wang
                </Typography>
            </Stack>
        </DialogContent>
    </Dialog>;
};

export default AboutDialog;


