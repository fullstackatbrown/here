import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Box, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { FC, Fragment, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useDialog } from '../ConfirmDialog/ConfirmDialogProvider';

interface GradeChipProps {
  score: number | undefined;
  maxScore: number;
  // readOnly determines whether the grade can be changed
  readOnly?: boolean;
  // inEditMode is whether the grade component is displayed as a text field
  inEditMode?: boolean;
  handleCreateGrade?: (grade: number) => void;
  handleDeleteGrade?: () => void;
}

type FormData = {
  grade: string
};

const GradeChip: FC<GradeChipProps> = ({ score, maxScore, readOnly = true, inEditMode = false, handleCreateGrade, handleDeleteGrade }) => {
  const defaultValues = useMemo(() => ({ grade: score ? score.toString() : "" }), [score])
  const { register, handleSubmit, reset, formState: { } } = useForm<FormData>({
    defaultValues: defaultValues
  });

  const showDialog = useDialog();

  useEffect(() => { reset(defaultValues) }, [defaultValues, reset])

  const onSubmit = handleSubmit(async data => {
    const grade = Number(data.grade)

    if (isNaN(grade)) {
      alert("Grade must be a number")
      reset()
      return
    }

    if (grade < 0) {
      alert("Grade must be non-negative")
      reset()
      return
    }

    if (grade > maxScore) {
      const confirmed = await showDialog({
        title: "Extra Credit",
        message: "Do you want to assign extra credit?",
      })
      if (!confirmed) {
        reset()
        return
      }
    }

    // if there existed a grade
    if (score !== undefined) {
      // if we are trying to delete it
      if (data.grade === "") {
        const confirmed = await showDialog({
          title: "Delete Grade",
          message: "Are you sure you want to delete this grade?",
        })
        confirmed && handleDeleteGrade && handleDeleteGrade()
      } else {
        handleCreateGrade && handleCreateGrade(grade)
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
    <Stack direction="row" spacing={0.5} alignItems="center">
      <Box width={readOnly ? 28 : 40} ml={inEditMode ? -1 : 0} mr={inEditMode ? 1 : 0} height={30} display="flex" alignItems="center">
        {inEditMode ?
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
              (readOnly ?
                <Tooltip title="Instructor has not released this grade" placement="right">
                  <HelpOutlineIcon fontSize="small" />
                </Tooltip> :
                <HelpOutlineIcon fontSize="small" />
              )
              :
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
      <Box display="flex" width={readOnly ? 22 : 35} justifyContent="flex-end">
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