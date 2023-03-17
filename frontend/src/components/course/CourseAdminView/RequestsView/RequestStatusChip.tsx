import React, { FC } from "react";
import { Chip } from "@mui/material";
import { SwapRequestStatus } from "model/swapRequest";

export interface RequestStatusChipProps {
    status: SwapRequestStatus;
    size?: "small" | "medium";
}

const RequestStatusChip: FC<RequestStatusChipProps> = ({ status, size }) => {
    switch (status) {
        case "approved":
            return <Chip label="approved" variant="outlined" size={size} color="success" />;
        case "denied":
            return <Chip label="denied" variant="outlined" size={size} color="error" />;
        case "archived":
            return <Chip label="archived" variant="outlined" size={size} />;
        case "cancelled":
            return <Chip label="cancelled" variant="outlined" size={size} />;
    }
};

export default RequestStatusChip;


