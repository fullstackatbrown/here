import { Box, ButtonBase, Card, Typography } from "@mui/material";
import { FC } from "react";

export interface AddCourseCardProps {
    onClick: () => void;
}

const AddCourseCard: FC<AddCourseCardProps> = ({ onClick }) => {
    return (
        <Card variant="outlined" sx={{ ':hover': { boxShadow: 2 } }}>
            <ButtonBase
                sx={{ width: "100%", textAlign: "left" }}
                onClick={onClick}
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

export default AddCourseCard;
