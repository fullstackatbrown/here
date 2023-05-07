import MyChip from "@components/shared/MyChip/MyChip";
import { formatRequestTime } from "@util/shared/requestTime";
import { SwapStatus } from "model/swap";
import React, { FC } from "react";

export interface RequestStatusChipProps {
    status: SwapStatus;
    timestamp?: Date;
    style?: React.CSSProperties
}

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


