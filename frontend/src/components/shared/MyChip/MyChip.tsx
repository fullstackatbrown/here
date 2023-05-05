import styled from "@emotion/styled";
import { Chip, ChipProps } from "@mui/material";

interface MyChipProps extends ChipProps {
    mycolor?: string;
}

function addAlpha(color: string, opacity: number): string {
    const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
}

const MyChip = styled(Chip)<MyChipProps>(({ size, variant, mycolor }) => {
    let style = {}
    switch (size) {
        case "medium":
            style = {
                height: 24,
                fontSize: 14,
                fontWeight: 500,
                '& .MuiChip-label': {
                    paddingLeft: 8,
                    paddingRight: 8,
                },
            }
            break
        default:
            style = {
                height: 20,
                fontSize: 11,
                fontWeight: 500,
                '& .MuiChip-label': {
                    paddingLeft: 6,
                    paddingRight: 6,
                },
            }
    }
    if (mycolor) {
        switch (variant) {
            case "outlined":
                style['borderColor'] = addAlpha(mycolor, 0.75)
                style['color'] = mycolor
                break
            default:
                style['backgroundColor'] = mycolor
                style['color'] = 'white'
        }
    }

    return style
});


export default MyChip