import React, { FC } from "react";
import { Chip, styled } from "@mui/material";
import { CourseStatus } from "model/course";

export interface CourseStatusChipProps {
    status: CourseStatus;
    style?: React.CSSProperties
}

const MyChip = styled(Chip)({
    height: 18,
    fontSize: 12,
    fontWeight: 500,
    '& .MuiChip-label': {
        paddingLeft: 6,
        paddingRight: 6,
    },
});

const CourseStatusChip: FC<CourseStatusChipProps> = ({ status, style }) => {
    switch (status) {
        case CourseStatus.CourseActive:
            return <MyChip label="active" variant="outlined" color="primary" style={style} />;
        case CourseStatus.CourseInactive:
            return <MyChip label="inactive" variant="outlined" color="secondary" style={style} />;
        case CourseStatus.CourseArchived:
            return <MyChip label="archived" variant="outlined" color="secondary" style={style} />;
    }
};

export default CourseStatusChip;


