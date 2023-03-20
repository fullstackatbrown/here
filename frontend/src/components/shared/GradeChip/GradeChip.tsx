import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Box, Stack, Typography } from "@mui/material";

export const GradeChip = ({
  score,
  maxScore,
}: {
  score: number | undefined;
  maxScore: number;
}) => {
  return (
    <Stack direction="row" spacing={2}>
      <Box sx={{ width: "18px" }}>
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
      <Box sx={{ width: "15px" }}>
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
      <Box sx={{ width: "15px" }}>
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
