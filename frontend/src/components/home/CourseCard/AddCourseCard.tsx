import { Box, Button, ButtonBase, Card, Paper, Stack, Typography } from "@mui/material";
import getCourseColor from "@util/shared/getCourseColor";
import { Course } from "model/course";
import { useRouter } from "next/router";
import { FC } from "react";
import UserAccessChip from "./UserAccessChip";

/**
 * CourseCard is a clickable card that is apart of the home page section grid. Contains the course title, section title,
 * number of tickets, location, and the ending time.
 */
const CourseCard: FC = () => {
    return (
        // <Paper variant="outlined" sx={{ overflow: "hidden" }}>
        <Card variant="outlined" sx={{ ':hover': { boxShadow: 2 } }}>
            <ButtonBase
                sx={{ width: "100%", textAlign: "left" }}
                focusRipple
            >
                <Box
                    width="100%"
                    height={179}
                    p={2}
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Typography variant="button" color="primary" fontSize={16}>+ Add A Course</Typography>
                </Box>
            </ButtonBase>
        </Card>

    );
};

export default CourseCard;
