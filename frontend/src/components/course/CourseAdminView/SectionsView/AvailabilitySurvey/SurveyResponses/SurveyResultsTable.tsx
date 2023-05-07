import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
    Box,
    Collapse,
    Stack,
    Table,
    TableBody,
    TableHead,
    TableRow,
    Typography,
    styled
} from "@mui/material";
import MuiTableCell, { TableCellProps } from "@mui/material/TableCell";
import { red } from '@mui/material/colors';
import { CourseUserData } from "model/course";
import { SurveyOption } from 'model/survey';
import React, { FC, useState } from "react";

export interface SurveyResultsTableProps {
    options: SurveyOption[];
    results: Record<string, CourseUserData[]>;
}

interface StyledTableCellProps extends TableCellProps {
    open?: boolean;
}

const TableCell = styled(MuiTableCell)<StyledTableCellProps>(({ theme, open }) => ({
    borderBottom: open ? "unset" : undefined,
    ":last-of-type": {
        paddingLeft: 0,
        paddingRight: 0,
    },
}))


const SurveyResultsTable: FC<SurveyResultsTableProps> = ({ results, options }) => {
    const capacity = options.reduce((map, option) => {
        map[option.option] = option.capacity;
        return map;
    }, {} as Record<string, number>);

    const [selectedOption, setSelectedOption] = useState<string>(undefined);

    const toggleOpen = (option: string) => {
        if (selectedOption === option) {
            setSelectedOption(undefined);
        } else {
            setSelectedOption(option);
        }
    }

    return <Table>
        <colgroup>
            <col style={{ width: "55%" }} />
            <col style={{ width: "40%" }} />
            <col style={{ width: "5%" }} />
        </colgroup>
        <TableHead>
            <TableRow>
                <TableCell>Option</TableCell>
                <TableCell align="center">Capacity</TableCell>
                <TableCell />
            </TableRow>
        </TableHead>
        <TableBody>
            {Object.keys(results).map((option) => {
                const students = results[option] || []
                const numStudents = students.length;
                const open = selectedOption === option;
                return (
                    <React.Fragment key={option}>
                        <TableRow
                            hover={numStudents > 0}
                            onClick={() => numStudents > 0 && toggleOpen(option)}
                            sx={open && {
                                '& > *': { borderBottom: 'unset' },
                                '&:last-child': { borderBottom: 'unset' }
                            }}
                        >
                            <TableCell open={open}>
                                {option}
                            </TableCell>
                            <TableCell sx={{ color: numStudents > capacity[option] ? red[500] : "default" }} align="center" open={open}>
                                {numStudents} / {capacity[option]}
                            </TableCell>
                            <TableCell open={open}>
                                <Box display="flex" alignItems="center">
                                    {/* {notInSurvey &&
                                        <Tooltip title="Added after survey has been published">
                                            <ErrorOutlineIcon color="secondary" sx={{ fontSize: 15 }} />
                                        </Tooltip>
                                    } */}
                                    {numStudents > 0 && (open ?
                                        <KeyboardArrowUpIcon color="secondary" sx={{ fontSize: 15 }} /> :
                                        <KeyboardArrowDownIcon color="secondary" sx={{ fontSize: 15 }} />)}
                                </Box>
                            </TableCell>
                        </TableRow>
                        <TableRow sx={!open && { display: "none" }}>
                            <MuiTableCell colSpan={4} sx={{ paddingTop: 1 }}>
                                <Collapse in={open} timeout="auto" unmountOnExit>
                                    <Stack direction="row" display="flex" alignItems="center" spacing={2}>
                                        <AccountCircleIcon color="secondary" sx={{ fontSize: 16 }} />
                                        <Typography fontSize={14} color="secondary">
                                            {results[option]?.map(s => s.displayName).join(", ")}
                                        </Typography>
                                    </Stack>
                                </Collapse>
                            </MuiTableCell>
                        </TableRow>
                    </React.Fragment>
                )
            })}
        </TableBody>
    </Table>
};

export default SurveyResultsTable;


