import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Box, Stack, Typography } from "@mui/material";
import { FC } from 'react';

interface GradeChipProps {
  score: number | undefined;
  maxScore: number;
}

const GradeChip: FC<GradeChipProps> = ({ score, maxScore }) => {
  return (
    <Stack direction="row" spacing={2}>
      <Box sx={{ width: "15px" }}>
        <Typography
          variant="body2"
          sx={{
            color: score === undefined ? "text.disabled" : "",
            textAlign: "center",
          }}
        >
          {score === undefined ? <HelpOutlineIcon fontSize="small" /> : score}
        </Typography>
      </Box>
      <Box sx={{ width: "12px" }}>
        <Typography
          variant="body2"
          sx={{
            color: score === undefined ? "text.disabled" : "",
            textAlign: "center",
          }}
        >
          /
        </Typography>
      </Box>
      <Box sx={{ width: "12px" }}>
        <Typography
          variant="body2"
          sx={{
            color: score === undefined ? "text.disabled" : "",
            textAlign: "center",
          }}
        >
          {maxScore}
        </Typography>
      </Box>
    </Stack>
  );
};

export default GradeChip;