import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';


const PieChart = ({ data }) => {
  return (
    <div className='w-80 ml-10 sm:ml-20 sm:h-[300px]'>
      <Pie data={data}  />
    </div>
  );
};

export default PieChart;
