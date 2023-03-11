import TabPanel from '@components/shared/TabPanel';
import { Animation, EventTracker, HoverState, SelectionState } from '@devexpress/dx-react-chart';
import {
    ArgumentAxis, BarSeries, Chart, ValueAxis
} from '@devexpress/dx-react-chart-material-ui';
import {
    Box,
    Button, Dialog, DialogActions, DialogContent,
    DialogTitle,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Typography
} from "@mui/material";
import { formatSectionResponses, mapToList, TimeCount } from "@util/shared/formatSectionResponses";
import { Survey } from "model/survey";
import { FC, useEffect, useState } from "react";

export interface SurveyResponsesDialogProps {
    open: boolean;
    onClose: () => void;
    survey: Survey;
}

enum Mode {
    CHART = 0,
    TABLE = 1
}

const SurveyResponsesDialog: FC<SurveyResponsesDialogProps> = ({ open, onClose, survey }) => {
    const [selected, setSelected] = useState(null)
    const [formattedResponses, setFormattedResponses] = useState<TimeCount[]>([])
    const [numResponses, setNumResponses] = useState(0)
    const [mode, setMode] = useState<Mode>(Mode.CHART);

    const handleChangeMode = (event: React.SyntheticEvent, newValue: number) => {
        setMode(newValue);
    };


    useEffect(() => {
        setNumResponses(Object.keys(survey.responses).length)
        setFormattedResponses(mapToList(formatSectionResponses(survey.responses)))
    }, [survey.responses])

    const getPercentage = (count) => Math.round((count / numResponses) * 100)

    const format = _ => (t) => {
        if (t % 1 === 0) {
            return t
        } else {
            return ""
        }
    };

    const compare = (
        { series, point }, { series: targetSeries, point: targetPoint },
    ) => series === targetSeries && point === targetPoint;

    const handleHover = (target) => {
        if (target) {
            setSelected(selected && compare(selected, target) ? null : target)
        } else {
            setSelected(null)
        }
    }

    return <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" keepMounted={false}>
        <DialogTitle>{survey.name} (Responses)</DialogTitle>
        <DialogContent>
            <>
                <Typography mb={3}>
                    Total responses: {numResponses}
                </Typography>

                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={mode} onChange={handleChangeMode}>
                        <Tab label="Chart" />
                        <Tab label="Table" />
                    </Tabs>
                </Box>
                <TabPanel value={mode} index={0}>
                    <Box height={20}>
                        {selected &&
                            <Typography textAlign={"left"}>
                                {formattedResponses[selected.point].time}:&nbsp;
                                {formattedResponses[selected.point].count} students available&nbsp;
                                ({getPercentage(formattedResponses[selected.point].count)}%)
                            </Typography>
                        }
                    </Box>


                    <Chart
                        height={300}
                        width={500}
                        data={formattedResponses}
                        rotated
                    >
                        <ArgumentAxis />
                        <ValueAxis tickFormat={format} />
                        <BarSeries valueField="count" argumentField="time" />
                        <Animation />
                        <EventTracker />
                        <HoverState onHoverChange={handleHover} />
                    </Chart>
                </TabPanel>
                <TabPanel value={mode} index={1}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Time</TableCell>
                                <TableCell align="right">Responses</TableCell>
                                <TableCell align="right">Percentage</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {formattedResponses.map((response) => (
                                <TableRow
                                    key={response.time}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {response.time}
                                    </TableCell>
                                    <TableCell align="right">{response.count}</TableCell>
                                    <TableCell align="right">{getPercentage(response.count)}%</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TabPanel>

            </>
        </DialogContent>
        <DialogActions>
            <Button type="submit" variant="contained">Allocate Sections</Button>
        </DialogActions>
    </Dialog>
};

export default SurveyResponsesDialog;


