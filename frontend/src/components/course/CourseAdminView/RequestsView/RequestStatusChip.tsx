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
        case SwapStatus.Approved:
            return <MyChip label="approved" variant="outlined" color="success" style={style} />;
        case SwapStatus.Denied:
            return <MyChip label="denied" variant="outlined" color="error" style={style} />;
        case SwapStatus.Archived:
            return <MyChip label="archived" variant="outlined" color="secondary" style={style} />;
        case SwapStatus.Cancelled:
            return <MyChip label="cancelled" variant="outlined" color="secondary" style={style} />;
        case SwapStatus.Pending:
            return <MyChip label="pending" variant="outlined" color="primary" style={style} />;
    }
};

export default RequestStatusChip;


