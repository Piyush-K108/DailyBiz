export const todayRevenueData = (labels, todayR) => {
  return {
    labels: labels,
    datasets: [
      {
        label: "Today's Revenue",
        data: todayR, // Replace these values with actual revenue data
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        fill: false,
      },
    ],

  };
};

export const monthlyRevenueData = (labels, MonthR) => {
  return {
  labels: labels,
  datasets: [
    {
      label: "Monthly Revenue",
      data: MonthR,
      backgroundColor: ["rgba(5, 99, 12, 0.7)" , "#ecf0f1" , "#50AF95" , "#f3ba2f" , "#2a71d0"],
      borderColor: "black",
      borderWidth: 1,
    },
  ],
}
};

export const weeklyRevenueData = (lables,WeekR) => {
  return {
    labels: lables,
    datasets: [
      {
        label: "Weekly Revenue",
        data: WeekR,
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };
};

export const yearlyRevenueData = (labels, YearR) => {
  return {
    labels: labels,
    datasets: [
      {
        label: "Yearly Revenue",
        data: YearR,
        backgroundColor: [
          "rgba(13, 132, 25, 0.7)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 1,
      },
    ],
  };
};


export const PieData = (labels, PieData) => {
  const colors = [
    'rgba(75, 192, 192, 0.6)',   // Green
    'rgba(255, 99, 132, 0.6)',   // Red
    'rgba(54, 162, 235, 0.6)',   // Blue
    'rgba(255, 206, 86, 0.6)',   // Yellow
    'rgba(153, 102, 255, 0.6)',  // Purple
  ];

  return {
    labels: labels,
    datasets: [
      {
        label: 'Revenue Of This Week',
        data: PieData,
        backgroundColor: colors,
        borderColor: colors.map(color => color.replace('0.6', '1')), 
        borderWidth: 2,
      },
    ],
  };
};







export const MultiLineData =(labels,Data1,Data2,Data3,Data4,Data5)=> {

  return{
  labels,
  datasets: [
    {
      label: 'Total Revenue ',
      data: Data1,
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      yAxisID: 'y',
    },
    {
      label: 'EV Revenue',
      data: Data2,
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
    {
      label: 'Petrol Revenue',
      data: Data3,
      borderColor: 'rgb(255, 165, 0)',  
      backgroundColor: 'rgba(255, 165, 0, 0.5)',  
    },
    {
      label: 'Advance Revenue',
      data: Data4,
      borderColor: 'rgb(255, 206, 86)',  
      backgroundColor: 'rgba(255, 206, 86, 0.5)',  
    },
    {
      label: 'Delivery Revenue',
      data: Data5,
      borderColor: 'rgb(48, 63, 159)',  
      backgroundColor: 'rgba(48, 63, 159, 0.5)',  
    },
  ],}
};
