import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
    Alert,
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
import { arrayUnion, arraysEqual } from '@util/shared/array';
import { formatSectionTime } from "@util/shared/time";
import { CourseUserData } from "model/course";
import { Section } from 'model/section';
import { sortSections } from "@util/shared/sortSectionTime";
import React, { FC, useMemo, useState } from "react";

export interface AllocatedSectionsTableProps {
    sectionCapacity: Record<string, Record<string, number>>;
    results: Record<string, CourseUserData[]>;
    sectionsMap: Record<string, Section>;
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


const AllocatedSectionsTable: FC<AllocatedSectionsTableProps> = ({ results, sectionsMap, sectionCapacity }) => {
    const [selectedSection, setSelectedSection] = useState<string>(undefined); // sectionID

    const toggleOpen = (sectionID: string) => {
        if (selectedSection === sectionID) {
            setSelectedSection(undefined);
        } else {
            setSelectedSection(sectionID);
        }
    }

    const sections = sortSections(useMemo(() => arrayUnion(Object.keys(results), Object.keys(sectionsMap)), [results, sectionsMap]).map(id => sectionsMap[id]))
    const sectionsChanged = useMemo(() => !arraysEqual(Object.keys(results), Object.keys(sectionsMap)), [results, sectionsMap])
    // a map from sectionID to the current capacity of each section
    const currentCapacityMap = useMemo(() => {
        const map: Record<string, number> = {};
        for (const [_, sectionCapacityMap] of Object.entries(sectionCapacity)) {
            for (const [sectionID, capacity] of Object.entries(sectionCapacityMap)) {
                map[sectionID] = capacity;
            }
        }
        return map;
    }, [sectionCapacity])


    return <Stack width="100%">
        {sectionsChanged &&
            <Alert severity="warning" sx={{ marginBottom: 2.5 }} style={{ display: 'flex', alignItems: 'center' }} >
                It looks like sections have been added or removed since the survey was created.&nbsp;
                Rerun the algorithm to update the results, or publish another survey if necessary.
            </Alert>
        }
        <Table>
            <colgroup>
                <col style={{ width: "43%" }} />
                <col style={{ width: "28%" }} />
                <col style={{ width: "21%" }} />
                <col style={{ width: "8%" }} />
            </colgroup>
            <TableHead>
                <TableRow>
                    <TableCell>Section Time</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell align="center">Current Capacity</TableCell>
                    <TableCell />
                </TableRow>
            </TableHead>
            <TableBody>
                {sections.map(section => {
                    const sectionID = section.ID;
                    const notInSurvey = !(sectionID in results)
                    const students = results?.[sectionID] || [];
                    const numStudents = students.length;
                    const open = selectedSection === sectionID;

                    let capacity = undefined;
                    if (sectionID in currentCapacityMap) {
                        capacity = currentCapacityMap[sectionID];
                    } else if (section) {
                        capacity = section.capacity - section.numEnrolled;
                    }

                    return <React.Fragment key={sectionID}>
                        <TableRow
                            hover={numStudents > 0}
                            onClick={() => numStudents > 0 && toggleOpen(sectionID)}
                            sx={{
                                '& > *': open && { borderBottom: 'unset' },
                                '&:last-child': open && { borderBottom: 'unset' },
                                "& > .MuiTableCell-root": {
                                    color: notInSurvey || !section ? "text.disabled" : "inherit"
                                },
                            }}
                        >
                            <TableCell open={open}>
                                {formatSectionTime(section)}
                            </TableCell>
                            <TableCell open={open}>
                                {section ? (section.location ? section.location : "TBD") : "/"}
                            </TableCell>
                            <TableCell sx={{ color: numStudents > section?.capacity ? red[500] : "default" }} align="center" open={open}>
                                {section ? `${numStudents} / ${capacity}` : "/"}
                            </TableCell>
                            <TableCell open={open}>
                                <Stack direction="row" spacing={0.8} display="flex" alignItems="center" justifyContent="flex-end">
                                    {notInSurvey &&
                                        <Tooltip title="Added after survey has been published">
                                            <ErrorOutlineIcon color="secondary" sx={{ fontSize: 15 }} />
                                        </Tooltip>
                                    }
                                    {!section &&
                                        <Tooltip title="Section got deleted after survey was published">
                                            <ErrorOutlineIcon color="secondary" sx={{ fontSize: 15 }} />
                                        </Tooltip>
                                    }
                                    {numStudents > 0 && (open ?
                                        <KeyboardArrowUpIcon color="secondary" sx={{ fontSize: 15 }} /> :
                                        <KeyboardArrowDownIcon color="secondary" sx={{ fontSize: 15 }} />)}
                                </Stack>
                            </TableCell>
                        </TableRow>
                        {open && <TableRow>
                            <MuiTableCell colSpan={4} sx={{ paddingTop: 1 }}>
                                <Collapse in={open} timeout="auto" unmountOnExit>
                                    <Stack direction="row" display="flex" alignItems="center" spacing={2}>
                                        <AccountCircleIcon color="secondary" sx={{ fontSize: 16 }} />
                                        <Typography fontSize={14} color="secondary">
                                            {results?.[sectionID]?.map(s => s.displayName).join(", ")}
                                        </Typography>
                                    </Stack>
                                </Collapse>
                            </MuiTableCell>
                        </TableRow>}
                    </React.Fragment>
                })}
            </TableBody>
        </Table>
    </Stack>
};

export default AllocatedSectionsTable;


