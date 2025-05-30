
import React from "react";
import { Bar} from "react-chartjs-2";
import {Chart as ChartJS} from 'chart.js/auto'
// defaults.global.maintainAspectRatio = false;
const BarChart = ({ data  }) => {
   const options = {
    spanGaps: true ,
    responsive: true,
     maintainAspectRatio: false ,
    plugins: {
      legend: {
        height:"100vh",
        display:"flex",
        
        padding:{
          top:'100px',

        },
        
      }
      ,
    },
  };
  return (
    <div className="sm:h-[300px] h-[230px] w-auto">
      {/* <h2>Bar Chart</h2> */}
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
