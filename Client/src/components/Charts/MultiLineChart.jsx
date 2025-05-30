import React from 'react';
import { Line } from 'react-chartjs-2';


const MultiLineChart = ({ data }) => {
 
  return (
    // <div>
    //   {/* <h2>Multi Line Chart</h2> */}
    //   <Line data={data} />
    // </div>
    <div className='sm:h-[300px] h-[230px] w-auto'>
      <Line
        data={data}
        options={{ maintainAspectRatio: false, responsive: true  }}
        
      />
    </div>
  );
};

export default MultiLineChart;