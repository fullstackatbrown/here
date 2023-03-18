import { HelpOutline, QuestionMarkOutlined } from "@mui/icons-material";
import { Grid, Typography } from "@mui/material";
import { Stack } from "@mui/system";

export const GradeChip = ({
  score,
  maxScore,
}: {
  score: number | undefined;
  maxScore: number;
}) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={1}>
        <Typography
          variant="body2"
          sx={{
            width: "20px",
            color: score === undefined ? "text.disabled" : "",
            textAlign: "center",
          }}
        >
          {score === undefined ? "?" : score}
        </Typography>
      </Grid>
      <Grid item xs={1}>
        <Typography
          variant="body2"
          sx={{
            width: "15px",
            color: score === undefined ? "text.disabled" : "",
            textAlign: "center",
          }}
        >
          /
        </Typography>
      </Grid>
      <Grid item xs={1}>
        <Typography
          variant="body2"
          sx={{
            width: "15px",
            color: score === undefined ? "text.disabled" : "",
            textAlign: "center",
          }}
        >
          {maxScore}
        </Typography>
      </Grid>
    </Grid>

    // <Stack direction="row" alignItems="center" gap={1}>
    //   {score === undefined ? (
    //     <HelpOutline fontSize="small" sx={{ color: "text.disabled" }} />
    //   ) : (
    //     <Typography
    //       variant="body2"
    //       sx={{
    //         width: "15px",
    //         color: score === undefined ? "text.disabled" : "",
    //         textAlign: "center",
    //       }}
    //     >
    //       {score}
    //     </Typography>
    //   )}
    //   <Typography
    //     variant="body2"
    //     sx={{ width: "15px", color: "text.disabled" }}
    //   >
    //     /
    //   </Typography>
    //   <Typography
    //     variant="body2"
    //     sx={{
    //       width: "15px",
    //       color: score === undefined ? "text.disabled" : "",
    //     }}
    //   >
    //     {maxScore}
    //   </Typography>
    // </Stack>
  );
};
