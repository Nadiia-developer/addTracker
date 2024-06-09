import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const LineChart = () => {
    const chartRef = useRef(null);

    useEffect(() => {
        const myChartRef = chartRef.current.getContext('2d');

        new Chart(myChartRef, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'Sales',
                        data: [10, 20, 30, 40, 50, 60],
                    },
                ],
            },
            options: {},
        });
    }, []);

    return (
        <canvas id="myChart" ref={chartRef} />
    );
};

export default LineChart;
