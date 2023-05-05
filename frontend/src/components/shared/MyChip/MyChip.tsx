import styled from "@emotion/styled";
import { Chip, ChipProps } from "@mui/material";

interface MyChipProps extends ChipProps {
    mycolor?: string;
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
                style['borderColor'] = mycolor
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