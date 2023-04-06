import React, { FC } from "react";
import { Chip } from "@mui/material";
import { SwapRequestStatus } from "model/swapRequest";

export interface RequestStatusChipProps {
    status: SwapRequestStatus;
    size?: "small" | "medium";
    style?: React.CSSProperties
}

const RequestStatusChip: FC<RequestStatusChipProps> = ({ status, size, style }) => {
    switch (status) {
        case "approved":
            return <Chip label="approved" variant="outlined" size={size} color="success" style={style} />;
        case "denied":
            return <Chip label="denied" variant="outlined" size={size} color="error" style={style} />;
        case "archived":
            return <Chip label="archived" variant="outlined" size={size} style={style} />;
        case "cancelled":
            return <Chip label="cancelled" variant="outlined" size={size} style={style} />;
    }
};

export default RequestStatusChip;


