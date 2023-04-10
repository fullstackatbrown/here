import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Box, IconButton, Stack, TextField, Typography } from "@mui/material";
import { FC, Fragment, useEffect } from 'react';
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
    <Stack direction="row" spacing={1} alignItems="center">
      <Box width={editable ? 40 : 28} ml={editable ? -1 : 0} mr={editable ? 1 : 0} height={30} display="flex" alignItems="center">
        {editable ?
          <form onSubmit={onSubmit}>
            <TextField
              size="small" variant="outlined"
              autoFocus inputProps={{ style: { padding: "5px 10px 5px 10px" }, }}
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
            {score === undefined ?
              <HelpOutlineIcon fontSize="small" /> :
              <Fragment>
                &nbsp;{score}
              </Fragment>
            }
          </Typography>
        }
      </Box>
      <Box width={12}>
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
      <Box display="flex" width={editable ? 35 : 22} justifyContent="flex-end">
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