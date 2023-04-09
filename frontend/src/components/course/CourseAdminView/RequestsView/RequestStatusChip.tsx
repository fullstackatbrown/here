import React, { FC } from "react";
import { Chip, styled } from "@mui/material";
import { SwapStatus } from "model/swap";

export interface RequestStatusChipProps {
    status: SwapStatus;
    style?: React.CSSProperties
}

const MyChip = styled(Chip)({
    height: 20,
    fontSize: 12,
    fontWeight: 500,
    '& .MuiChip-label': {
        paddingLeft: 8,
        paddingRight: 8,
    },
});

const RequestStatusChip: FC<RequestStatusChipProps> = ({ status, style }) => {
    switch (status) {
        case "approved":
            return <MyChip label="approved" variant="outlined" color="success" style={style} />;
        case "denied":
            return <MyChip label="denied" variant="outlined" color="error" style={style} />;
        case "archived":
            return <MyChip label="archived" variant="outlined" style={style} />;
        case "cancelled":
            return <MyChip label="cancelled" variant="outlined" style={style} />;
    }
};

export default RequestStatusChip;


