import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack } from "@mui/material";
import { Season } from "@util/shared/terms";
import { FC } from "react";

interface TermTextfieldProps {
    term: [Season, string];
    setTerm: (term: [Season, string]) => void;
}


const TermTextfield: FC<TermTextfieldProps> = ({ term, setTerm }) => {

    const handleChangeSeason = (event: SelectChangeEvent) => {
        setTerm([event.target.value as Season, term[1]]);
    };

    const handleChangeYear = (event: SelectChangeEvent) => {
        setTerm([term[0], event.target.value as string]);
    };

    const years = Array.from(Array(4).keys()).map((_, i) => new Date().getFullYear() - 1 + i);

    return <Stack direction="row" spacing={2} mt={2}>
        <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Season</InputLabel>
            <Select
                value={term[0]}
                onChange={(handleChangeSeason)}
                autoWidth
                label="Season"
            >
                {[Season.Spring, Season.Fall, Season.Summer, Season.Winter]
                    .map((season) => <MenuItem key={season} value={season}>{season}
                    </MenuItem>)
                }
            </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Year</InputLabel>
            <Select
                value={term[1]}
                onChange={handleChangeYear}
                autoWidth
                label="Year"
            >
                {years.map((year) => <MenuItem key={year} value={year}>{year}</MenuItem>)}
            </Select>
        </FormControl>
    </Stack>
}

export default TermTextfield