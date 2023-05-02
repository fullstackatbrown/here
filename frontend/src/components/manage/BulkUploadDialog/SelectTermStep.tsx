import { Stack, TextField, Typography } from "@mui/material";
import { FC } from "react";
import { useForm } from "react-hook-form";
import TermTextfield from "../TermTextfield/TermTextfield";
import { formatCourseTerm, parseCourseTerm } from "@util/shared/string";
import { Season } from "@util/shared/terms";

interface SelectTermStepProps {
    term: string;
    setTerm: (term: string) => void;
}

const SelectTermStep: FC<SelectTermStepProps> = ({ term, setTerm }) => {

    return <Stack spacing={3} my={1}>
        <Typography>
            Select the term for which you want to add courses and staff.
        </Typography>
        <TermTextfield term={parseCourseTerm(term)} setTerm={(term: [Season, string]) => { setTerm(formatCourseTerm(term)) }} />
    </Stack>
}

export default SelectTermStep