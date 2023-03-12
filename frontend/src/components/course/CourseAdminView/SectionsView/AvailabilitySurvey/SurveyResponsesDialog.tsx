import { blue } from '@mui/material/colors';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
    Box,
    Button, Dialog, DialogActions, DialogContent,
    DialogTitle,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tabs,
    Typography
} from "@mui/material";
import { formatSectionResponses, mapToList, TimeCount } from "@util/shared/formatSectionResponses";
import {
    BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title,
    Tooltip
} from 'chart.js';
import { Survey } from "model/survey";
import { FC, useEffect, useState } from "react";
import { Bar } from 'react-chartjs-2';
import TabPanel from '@components/shared/TabPanel';

export interface SurveyResponsesDialogProps {
    open: boolean;
    onClose: () => void;
    survey: Survey;
}

enum Mode {
    CHART = 0,
    TABLE = 1
}

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ChartDataLabels,
);

ChartJS.defaults.font.size = 16;


const SurveyResponsesDialog: FC<SurveyResponsesDialogProps> = ({ open, onClose, survey }) => {
    const [formattedResponses, setFormattedResponses] = useState<TimeCount[]>([])
    const [numResponses, setNumResponses] = useState(0)
    const [mode, setMode] = useState<Mode>(Mode.CHART);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });

    const handleChangeMode = (event: React.SyntheticEvent, newValue: number) => {
        setMode(newValue);
    };

    const barChartOptions = {
        indexAxis: 'y' as const,
        elements: {
            bar: {
                borderWidth: 2,
            },
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
            datalabels: {
                display: true,
                anchor: "end" as const,
                align: "right" as const,
                formatter: function (value) {
                    return `${value} (${getPercentage(value)}%)`
                },
            }
        },
        events: [],

    };

    useEffect(() => {
        setNumResponses(Object.keys(survey.responses).length)
        const formattedRes = mapToList(formatSectionResponses(survey.responses))
        setFormattedResponses(formattedRes)
        setChartData({
            labels: formattedRes.map((data) => data.time),
            datasets: [
                {
                    data: formattedRes.map((data) => data.count),
                    backgroundColor: blue[500],
                    borderWidth: 0,
                    maxBarThickness: 25,
                }
            ]
        })
    }, [survey.responses])

    const getPercentage = (count) => Math.round((count / numResponses) * 100)

    return <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" keepMounted={false}>
        <DialogTitle>{survey.name} (Responses)</DialogTitle>
        <DialogContent >
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
                <TabPanel value={mode} index={0} >
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        minWidth: "50%",
                        minHeight: 300,
                    }}
                    >
                        <Box sx={{
                            minWidth: "50%",
                            minHeight: 300,
                        }}
                        >
                            <Bar
                                data={chartData}
                                options={barChartOptions}
                            />
                        </Box>
                    </Box>
                </TabPanel>
                <TabPanel value={mode} index={1}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Time</TableCell>
                                <TableCell align="right"># Students Available</TableCell>
                                <TableCell align="right">% Students Available</TableCell>
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
    </Dialog >
};

export default SurveyResponsesDialog;


