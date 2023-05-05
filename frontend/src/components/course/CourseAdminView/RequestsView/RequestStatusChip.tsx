import React, { FC } from "react";
import { Box, Chip, styled } from "@mui/material";
import { SwapStatus } from "model/swap";
import DoneIcon from '@mui/icons-material/Done';
import { formatRequestTime } from "@util/shared/requestTime";

export interface RequestStatusChipProps {
    status: SwapStatus;
    timestamp?: Date;
    style?: React.CSSProperties
}

const MyChip = styled(Chip)({
    height: 20,
    fontSize: 11,
    fontWeight: 500,
    '& .MuiChip-label': {
        paddingLeft: 6,
        paddingRight: 6,
    },
});

const colors: Record<SwapStatus, "success" | "error" | "secondary" | "primary"> = {
    [SwapStatus.Approved]: "success",
    [SwapStatus.Denied]: "error",
    [SwapStatus.Archived]: "secondary",
    [SwapStatus.Cancelled]: "secondary",
    [SwapStatus.Pending]: "primary",
}

const RequestStatusChip: FC<RequestStatusChipProps> = ({ status, timestamp, style }) => {
    const pending = status === SwapStatus.Pending;
    const getLabel = (status: SwapStatus) =>
        (pending ? "submitted" : status) + (timestamp ? ` ${formatRequestTime(timestamp, false, pending)}` : "")
    return <MyChip label={getLabel(status)} variant="outlined" color={colors[status]} style={style} />;
};

export default RequestStatusChip;


