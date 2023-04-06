import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Box, IconButton, Stack, TextField, Typography } from "@mui/material";
import { FC, useEffect } from 'react';
import EditIcon from "@mui/icons-material/Edit";
import { useForm } from 'react-hook-form';

interface GradeChipProps {
  score: number | undefined;
  maxScore: number;
  editable?: boolean;
  submitGrade?: (grade: number) => void;
}

type FormData = {
  grade: number
};

const GradeChip: FC<GradeChipProps> = ({ score, maxScore, editable = false, submitGrade }) => {

  const { register, handleSubmit, getValues, reset, watch, formState: { } } = useForm<FormData>({
    defaultValues: { grade: score }
  });

  useEffect(() => {
    const subscription = watch((value, { name, type }) => console.log(value, name, type));
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => { reset({ grade: score }) }, [score])

  const onSubmit = handleSubmit(async data => {
    if (isNaN(Number(data.grade))) {
      alert("Grade must be a number")
      reset()
      return
    }
    if (submitGrade) {
      submitGrade(data.grade)
    }
  })

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Box sx={{ width: editable ? "50px" : "15px" }}>
        {editable ?
          <form onSubmit={onSubmit}>
            <TextField
              size="small" variant="outlined"
              autoFocus inputProps={{ padding: 0 }}
              {...register("grade")}
            />
          </form> :
          <Typography
            variant="body2"
            sx={{
              color: score === undefined ? "text.disabled" : "",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
            }}
          >
            {score === undefined ? <HelpOutlineIcon fontSize="small" /> : score}
          </Typography>
        }

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