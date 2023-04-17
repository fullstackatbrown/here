import styled from "@emotion/styled";
import { TextField } from "@mui/material";

export const DisabledTextField = styled(TextField)({
    '& .MuiInput-underline:before': {
        borderBottomColor: 'rgba(0, 0, 0, 0.42)',
        borderBottomWidth: 1,
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: 'rgba(0, 0, 0, 0.42)',
        borderBottomWidth: 1,
    },
    '&:hover .MuiInput-underline:before': {
        borderBottomColor: 'rgba(0, 0, 0, 0.42)',
        borderBottomWidth: 1,
    },
    '&.Mui-focused .MuiInput-underline:before': {
        borderBottomColor: 'rgba(0, 0, 0, 0.42)',
        borderBottomWidth: 1,
    },
    '& .MuiInputLabel-root': {
        color: 'rgba(0, 0, 0, 0.54)',
        fontSize: '1rem',
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: 'rgba(0, 0, 0, 0.54)',
    },
});
