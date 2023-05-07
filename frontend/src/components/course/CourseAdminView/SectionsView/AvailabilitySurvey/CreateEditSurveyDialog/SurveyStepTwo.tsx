import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Checkbox, FormControlLabel, Grid, IconButton, Stack, TextField, Typography, styled } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { FieldArrayWithId, UseFieldArrayAppend, UseFieldArrayInsert, UseFieldArrayRemove, UseFieldArrayReplace, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { SurveyFormData } from "./CreateEditSurveyDialog";
import { Section } from 'model/section';
import { getUniqueSectionTimes } from '@util/shared/sortSectionTime';

export interface SurveyStepTwoProps {
    register: UseFormRegister<SurveyFormData>;
    fields: FieldArrayWithId<SurveyFormData, "options", "id">[];
    remove: UseFieldArrayRemove;
    setValue: UseFormSetValue<SurveyFormData>;
    insert: UseFieldArrayInsert<SurveyFormData, "options">;
    replace: UseFieldArrayReplace<SurveyFormData, "options">;
    sections: Section[];
}

const TableHeader = styled(Typography)(({ theme }) => ({
    fontWeight: 500,
    fontSize: 14
}))

const GridItem = styled(Grid)(({ theme }) => ({
    display: "flex",
    alignItems: "center"
}))

const SurveyStepTwo: FC<SurveyStepTwoProps> = ({ register, fields, remove, setValue, insert, replace, sections }) => {
    const [hover, setHover] = useState<number | undefined>(undefined);
    const [useSectionData, setUseSectionData] = useState<boolean>(false);

    function handleRemove(index: number) {
        if (index === 0) {
            setValue(`options.${index}.option`, "")
            setValue(`options.${index}.capacity`, "")
            return
        }
        remove(index);
    }

    function handleInsert(index: number) {
        insert(index, { option: "", capacity: "" });
    }

    useEffect(() => {
        if (useSectionData) {
            replace(getUniqueSectionTimes(sections))
        } else {
            replace([{ option: "", capacity: "" }])
        }
    }, [useSectionData])

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
        {fields.map((field, index) =>
            <Box
                key={field.id}
                onMouseEnter={() => setHover(index)}
                onMouseLeave={() => setHover(undefined)}
            >
                <Grid container my={1} columnSpacing={3}>
                    <GridItem item xs={7.5}>
                        <TextField
                            {...register(`options.${index}.option`, { required: true })}
                            required
                            autoFocus
                            type="text"
                            fullWidth
                            size="small"
                            placeholder="Monday 9:00am - 11:00am"
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
                    <GridItem item xs={3}>
                        <TextField
                            {...register(`options.${index}.capacity`, { required: true, valueAsNumber: true })}
                            required
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
                        {!useSectionData && (hover === index || (hover === undefined && index === fields.length - 1)) &&
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
        )}
        <Box mt={1.5}>
            <FormControlLabel
                control={<Checkbox size="small" onChange={(event) => setUseSectionData(event.target.checked)} />}
                label="Use Section Data"
                sx={{
                    '& .MuiTypography-root': {
                        fontSize: 14,
                    },
                }}
            />
        </Box>

    </Stack >
}

export default SurveyStepTwo