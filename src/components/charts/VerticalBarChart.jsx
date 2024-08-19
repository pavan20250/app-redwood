import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const VerticalBarChart = ({ data, width, height }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Sort data by financial year
    const sortedData = [...data].sort((a, b) => {
      const yearA = parseInt(a.year.split('-')[0]);
      const yearB = parseInt(b.year.split('-')[0]);
      return yearA - yearB;
    });

    const ctx = chartRef.current.getContext('2d');
    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: sortedData.map(item => item.year),
        datasets: [
          {
            label: 'No of Startups',
            data: sortedData.map(item => item.count),
            backgroundColor: '#007bff',
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1, // Ensures only whole numbers are displayed
              callback: function(value) { if (Number.isInteger(value)) { return value; } } // Only display whole numbers
            },
            title: {
              display: true,
              text: 'Number of Startups',
            },
          },
          x: {
            title: {
              display: true,
              text: 'Financial Year',
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
        maintainAspectRatio: false, // Allows you to set custom width and height
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [data]);

  return (
    <div style={{ width: width, height: height }}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default VerticalBarChart;
