import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
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
    Tooltip,
    Typography,
    styled
} from "@mui/material";
import MuiTableCell, { TableCellProps } from "@mui/material/TableCell";
import { red } from '@mui/material/colors';
import { formatSectionTime } from "@util/shared/time";
import { sortSections } from "@util/shared/sortSectionTime";
import { CourseUserData } from "model/course";
import { Section } from 'model/section';
import React, { FC, useState } from "react";

export interface AllocatedSectionsTableProps {
    results: Record<string, CourseUserData[]>;
    sections: Section[];
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


const AllocatedSectionsTable: FC<AllocatedSectionsTableProps> = ({ results, sections }) => {
    const [selectedSection, setSelectedSection] = useState<string>(undefined); // sectionID

    const toggleOpen = (sectionID: string) => {
        if (selectedSection === sectionID) {
            setSelectedSection(undefined);
        } else {
            setSelectedSection(sectionID);
        }
    }

    return <Table>
        <colgroup>
            <col style={{ width: "50%" }} />
            <col style={{ width: "30%" }} />
            <col style={{ width: "17%" }} />
            <col style={{ width: "3%" }} />
        </colgroup>
        <TableHead>
            <TableRow>
                <TableCell>Section Time</TableCell>
                <TableCell>Location</TableCell>
                <TableCell align="center">Capacity</TableCell>
                <TableCell />
            </TableRow>
        </TableHead>
        <TableBody>
            {sortSections(sections).map((section) => {
                const notInSurvey = !(section.ID in results)
                const numStudents = results[section.ID]?.length || 0
                const time = formatSectionTime(section)
                const open = selectedSection === section.ID
                return (
                    <React.Fragment key={section.ID}>
                        <TableRow
                            hover={numStudents > 0}
                            onClick={() => numStudents > 0 && toggleOpen(section.ID)}
                            sx={open && {
                                '& > *': { borderBottom: 'unset' },
                                '&:last-child': { borderBottom: 'unset' }
                            }}
                        >
                            <TableCell open={open}>
                                {time}
                            </TableCell>
                            <TableCell open={open}>
                                {section.location ? section.location : "TBD"}
                            </TableCell>
                            <TableCell sx={{ color: numStudents > section.capacity ? red[500] : "default" }} align="center" open={open}>
                                {numStudents} / {section.capacity}
                            </TableCell>
                            <TableCell open={open}>
                                <Box display="flex" alignItems="center">
                                    {notInSurvey &&
                                        <Tooltip title="Added after survey has been published">
                                            <ErrorOutlineIcon color="secondary" sx={{ fontSize: 15 }} />
                                        </Tooltip>
                                    }
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
                                            {results[section.ID]?.map(s => s.displayName).join(", ")}
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

export default AllocatedSectionsTable;


