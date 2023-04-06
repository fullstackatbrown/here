import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Box, IconButton, Stack, TextField, Typography } from "@mui/material";
import { FC, useEffect } from 'react';
import EditIcon from "@mui/icons-material/Edit";
import { useForm } from 'react-hook-form';

interface GradeChipProps {
  score: number | undefined;
  maxScore: number;
  editable?: boolean;
  handleCreateGrade?: (grade: number) => void;
  handleUpdateGrade?: (grade: number) => void;
  handleDeleteGrade?: () => void;
}

type FormData = {
  grade: string
};

const GradeChip: FC<GradeChipProps> = ({ score, maxScore, editable = false, handleCreateGrade, handleUpdateGrade, handleDeleteGrade }) => {

  const { register, handleSubmit, reset, formState: { } } = useForm<FormData>({
    defaultValues: { grade: score ? score.toString() : "" }
  });

  useEffect(() => { reset({ grade: score ? score.toString() : "" }) }, [score])

  const onSubmit = handleSubmit(async data => {
    const grade = Number(data.grade)

    if (isNaN(grade)) {
      alert("Grade must be a number")
      reset()
      return
    }

    if (grade > maxScore) {
      alert("Invalid grade")
      reset()
      return
    }

    // if there existed a grade
    if (score !== undefined) {
      // if we are trying to delete it
      if (data.grade === "") {
        const confirmed = confirm("Are you sure you want to delete this grade?")
        confirmed && handleDeleteGrade && handleDeleteGrade()
      } else {
        handleUpdateGrade && handleUpdateGrade(grade)
      }
      return
    }

    // new grade
    if (data.grade === "") {
      alert("Please enter a grade")
      reset()
      return
    }
    handleCreateGrade && handleCreateGrade(grade)
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