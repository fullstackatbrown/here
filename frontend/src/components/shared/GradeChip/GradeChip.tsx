import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Box, IconButton, Stack, TextField, Typography } from "@mui/material";
import { FC } from 'react';
import EditIcon from "@mui/icons-material/Edit";

interface GradeChipProps {
  score: number | undefined;
  maxScore: number;
  editable?: boolean;
}

const GradeChip: FC<GradeChipProps> = ({ score, maxScore, editable = true }) => {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Box sx={{ width: editable ? "50px" : "15px" }}>
        <Typography
          variant="body2"
          sx={{
            color: score === undefined ? "text.disabled" : "",
            textAlign: "center",
          }}
        >
          {editable ?
            < TextField
              size="small" variant="outlined"
              autoFocus inputProps={{ padding: 0 }}
              defaultValue={score}
            />
            :
            (score === undefined ? <HelpOutlineIcon fontSize="small" /> : score)
          }
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
      {/* <IconButton size="small">
        <EditIcon fontSize="small" />
      </IconButton> */}
    </Stack>
  );
};

export default GradeChip;