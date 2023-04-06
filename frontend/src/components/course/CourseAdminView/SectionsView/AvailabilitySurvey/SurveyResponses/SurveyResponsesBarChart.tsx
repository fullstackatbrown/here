import {
    Box
} from "@mui/material";
import { blue } from '@mui/material/colors';
import { TimeCount } from "@util/shared/formatSectionResponses";
import {
    BarElement, CategoryScale, Chart as ChartJS, LinearScale, Scale
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FC, useEffect, useRef, useState } from "react";
import { Bar } from 'react-chartjs-2';

export interface SurveyResponsesBarChartProps {
    formattedResponses: TimeCount[];
    numResponses: number;
    numStudents: number;
}

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ChartDataLabels,
);

ChartJS.defaults.font.size = 16;


const SurveyResponsesBarChart: FC<SurveyResponsesBarChartProps> = ({ formattedResponses, numResponses, numStudents }) => {
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
        layout: {
            padding: {
                left: 60,
                right: 80,
                top: 20,
                bottom: 20
            }
        },
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
                    if (numResponses === 0) {
                        return ""
                    } else {
                        const percentage = Math.round((value / numResponses) * 100)
                        return `${value} (${percentage}%)`
                    }

                },
            }
        },
        scales: {
            x:
            {
                max: numResponses > 10 ? numResponses : (numStudents > 10 ? numStudents : 10),
            },
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

    return <Bar
        data={chartData}
        options={barChartOptions}
    />
};

export default SurveyResponsesBarChart;


