import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { Pie } from 'react-chartjs-2';

Chart.register(...registerables);

const Pie3DChart = ({ data, width, height }) => {
    const colors = {
        "Pipeline": "#FF6384",
        "Under Process": "#36A2EB",
        "On-Hold": "#FFCE56",
        "Non-Responsive": "#FF9F40",
        "Backed out": "#FF6384",
        "Rejected": "#36A2EB",
        "Completed": "#4BC0C0"
    };

    const chartData = {
        labels: Object.keys(data),
        datasets: [{
            data: Object.values(data),
            backgroundColor: Object.keys(data).map(key => colors[key]),
            hoverBackgroundColor: Object.keys(data).map(key => colors[key]),
            borderWidth: 2,
            borderColor: '#fff',
            hoverOffset: 10,
        }]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                }
            },
            tooltip: {
                backgroundColor: '#000',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#fff',
                borderWidth: 1,
            },
        },
        elements: {
            arc: {
                borderWidth: 1,
                borderColor: '#000',
            }
        }
    };

    return <Pie data={chartData} options={options} width={width} height={height} />;
};

export default Pie3DChart;
