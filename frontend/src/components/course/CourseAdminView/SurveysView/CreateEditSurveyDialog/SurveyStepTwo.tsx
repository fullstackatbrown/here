import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Button, Checkbox, FormControlLabel, Grid, IconButton, Stack, TextField, Typography, styled } from "@mui/material";
import { FC, useState } from "react";
import { FieldArrayWithId, UseFieldArrayInsert, UseFieldArrayRemove, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { SurveyFormData } from "./CreateEditSurveyDialog";
import { Survey } from 'model/survey';

export interface SurveyStepTwoProps {
    survey: Survey;
    register: UseFormRegister<SurveyFormData>;
    remove: UseFieldArrayRemove;
    setValue: UseFormSetValue<SurveyFormData>;
    insert: UseFieldArrayInsert<SurveyFormData, "options">;
    options: FieldArrayWithId<SurveyFormData, "options", "id">[];
    useSectionData: boolean;
    setUseSectionData: (value: boolean) => void;
    handleResyncSectionData: () => void;
}

const TableHeader = styled(Typography)(({ theme }) => ({
    fontWeight: 500,
    fontSize: 14
}))

const GridItem = styled(Grid)(({ theme }) => ({
    display: "flex",
    alignItems: "center"
}))

const SurveyStepTwo: FC<SurveyStepTwoProps> = ({
    survey, register, options, remove, setValue, insert, useSectionData, setUseSectionData, handleResyncSectionData
}) => {
    const [hover, setHover] = useState<number | undefined>(undefined);

    function handleRemove(index: number) {
        if (index === 0) {
            setValue(`options.${index}.option`, "")
            setValue(`options.${index}.capacity`, NaN)
            return
        }
        remove(index);
    }

    function handleInsert(index: number) {
        insert(index, { option: "", capacity: NaN });
    }

    return <Stack direction="column">
        <Grid container my={1} columnSpacing={3}>
            <GridItem item xs={7.5}>
                <TableHeader>Option</TableHeader>
            </GridItem>
            <GridItem item xs={3}>
                <TableHeader>Capacity</TableHeader>
            </GridItem>
            <GridItem item xs={1.5}>
            </GridItem>
        </Grid>
        {options.map((field, index) => {
            return <Box
                key={field.id}
                onMouseEnter={() => setHover(index)}
                onMouseLeave={() => setHover(undefined)}
            >
                <Grid container my={1} columnSpacing={3}>
                    <GridItem item xs={7.5}>
                        <TextField
                            {...register(`options.${index}.option` as const)}
                            autoFocus
                            type="text"
                            fullWidth
                            size="small"
                            placeholder="Discussion Group 1"
                            variant="standard"
                            InputProps={{
                                onFocus: () => setHover(index),
                            }}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    handleInsert(index + 1);
                                }
                                if (event.key === "Backspace" && field.option === "") {
                                    handleRemove(index);
                                }
                            }}
                            disabled={useSectionData}
                        />
                    </GridItem>
                    <GridItem item xs={3}>
                        <TextField
                            {...register(`options.${index}.capacity` as const, { valueAsNumber: true })}
                            type="number"
                            placeholder="0"
                            fullWidth
                            size="small"
                            variant="standard"
                            InputProps={{
                                onFocus: () => setHover(index),
                            }}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    handleInsert(index + 1);
                                }
                            }}
                            disabled={useSectionData}
                        />
                    </GridItem>
                    <GridItem item xs={1.5}>
                        {!useSectionData && (hover === index || (hover === undefined && index === options.length - 1)) &&
                            <Stack direction="row" spacing={0.5}>
                                <IconButton onClick={() => handleRemove(index)} sx={{ padding: 0.5 }}>
                                    <ClearIcon sx={{ fontSize: 18 }} />
                                </IconButton>
                                <IconButton onClick={() => handleInsert(index + 1)} sx={{ padding: 0.3 }}>
                                    <AddIcon sx={{ fontSize: 20 }} />
                                </IconButton>
                            </Stack>
                        }
                    </GridItem>
                </Grid>
            </Box>
        }
        )}
        {/* If creating survey, show checkbox for using section data */}
        {/* If updating survey, if survey used section data, show resync button, otherwise show nothing */}
        {survey ?
            (useSectionData && <Box mt={1.5}>
                <Button
                    startIcon={<RefreshIcon />}
                    sx={{ fontSize: 14, py: 0.5, ml: -0.5 }}
                    onClick={handleResyncSectionData}
                >
                    Resync with section data
                </Button>
            </Box>
            ) :
            <Box mt={1.5}>
                <FormControlLabel
                    control={
                        <Checkbox
                            size="small"
                            checked={useSectionData}
                            onChange={(event) => setUseSectionData(event.target.checked)}
                        />
                    }
                    label="Use Section Data"
                    sx={{
                        '& .MuiTypography-root': {
                            fontSize: 14,
                        },
                    }}
                />
            </Box>
        }
    </Stack >
}

export default SurveyStepTwo