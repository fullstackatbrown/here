import {
    Box
} from "@mui/material";
import { blue } from '@mui/material/colors';
import { TimeCount } from "@util/shared/formatSectionResponses";
import {
    BarElement, CategoryScale, Chart as ChartJS, LinearScale
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FC, useEffect, useState } from "react";
import { Bar } from 'react-chartjs-2';

export interface SurveyResponsesBarChartProps {
    formattedResponses: TimeCount[];
    numResponses: number;
}

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ChartDataLabels,
);

ChartJS.defaults.font.size = 16;


const SurveyResponsesBarChart: FC<SurveyResponsesBarChartProps> = ({ formattedResponses, numResponses }) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });

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
        setChartData({
            labels: formattedResponses.map((data) => data.time),
            datasets: [
                {
                    data: formattedResponses.map((data) => data.count),
                    backgroundColor: blue[500],
                    borderWidth: 0,
                    maxBarThickness: 25,
                }
            ]
        })
    }, [formattedResponses])

    const getPercentage = (count) => Math.round((count / numResponses) * 100)

    return <Box sx={{
        minWidth: "50%",
        minHeight: 300,
    }}
    >
        <Bar
            data={chartData}
            options={barChartOptions}
        />
    </Box>
};

export default SurveyResponsesBarChart;


