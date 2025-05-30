import React, { useMemo } from "react";
import { useTheme, Typography, Box } from "@mui/material";
import { ResponsiveLine } from "@nivo/line";

const OverviewChart = ({ isDashboard = false, data,hasRevenueAccess }) => {
  const theme = useTheme();

  // Ensure all 12 months are covered
  const allMonths = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const totalRevenueLine = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    let lastAmount = null; // Track previous month's amount for % change

    const totalRevenueLine = {
      id: "Total Revenue",
      color: theme.palette.secondary.main,
      data: [],
    };

     allMonths.map((month, index) => {
      const monthData = data.find((item) => item.month === month);
      const currentAmount = monthData && hasRevenueAccess ? monthData.totalAmount : 0;
  

      // Calculate % increase/decrease
      let percentageChange = null;
      if (index > 0 && lastAmount !== null && lastAmount !== 0) {
        percentageChange = ((currentAmount - lastAmount) / lastAmount) * 100;
      }
      lastAmount = currentAmount;

      totalRevenueLine.data.push({ 
        x: month, 
        y: currentAmount, 
        percentageChange: percentageChange !== null ? percentageChange.toFixed(2) : null 
      });

      return { x: month, y: currentAmount };
    });

    return [totalRevenueLine];
  }, [data]);

  if (!data || data.length === 0) return "Loading...";

  // Calculate Total Revenue for the Year
  const totalYearlyRevenue = data.reduce((sum, d) => sum + d.totalAmount, 0);

  // Get max value from data for Y-Axis scaling
  const maxYValue = data.length > 0 && hasRevenueAccess
    ? Math.max(...data.map(d => d.totalAmount)) + 100000 
    : "auto"; 

  return (
    <>
    <Box position={'relative'}>
    <Typography 
        variant="body2" 
        fontWeight="bold" 
        color={'#000'} 
        sx={{ position: "absolute", top: 0, right: 10, zIndex: 10 }}
      >
        Total: ₹{hasRevenueAccess?totalYearlyRevenue.toLocaleString():0}
      </Typography>
    </Box>
      <ResponsiveLine
        data={totalRevenueLine}
        theme={{
          axis: {
            domain: { line: { stroke: theme.palette.secondary[200] } },
            legend: { text: { fill: theme.palette.secondary[200] } },
            ticks: {
              line: { stroke: theme.palette.secondary[200], strokeWidth: 1 },
              text: { fill: theme.palette.secondary[200] },
            },
          },
          tooltip: {
            container: { background: "white", color: "black", padding: "8px", borderRadius: "5px" },
          },
        }}
        margin={{ top: -20, right: 50, bottom: 50, left: 70 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: 0, 
          max: maxYValue, 
          stacked: false,
          reverse: false,
        }}
        yFormat={(value) => `₹${value.toLocaleString()}`} // Format Y-axis values with ₹
        curve="catmullRom"
        enableArea={true}
        areaBaselineValue={0}
        fillOpacity={0.3}
        axisBottom={{
          format: (v) => (isDashboard ? v.slice(0, 3) : v),
          orient: "bottom",
          tickSize: 5,
          tickPadding: 5,
          legend: isDashboard ? "" : "Month",
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={{
          orient: "left",
          tickValues: 5,
          tickSize: 5,
          tickPadding: 5,
          legend: isDashboard ? "" : "Monthly Revenue (₹)",
          legendOffset: -60,
          legendPosition: "middle",
        }}
        enableGridX={false}
        enableGridY={false}
        pointSize={10}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={
          !isDashboard
            ? [
                {
                  anchor: "bottom-right",
                  direction: "column",
                  translateX: 30,
                  translateY: -40,
                  itemsSpacing: 0,
                  itemDirection: "left-to-right",
                  itemWidth: 80,
                  itemHeight: 20,
                  itemOpacity: 0.75,
                  symbolSize: 12,
                  symbolShape: "circle",
                  effects: [
                    {
                      on: "hover",
                      style: {
                        itemBackground: "rgba(0, 0, 0, .03)",
                        itemOpacity: 1,
                      },
                    },
                  ],
                },
              ]
            : undefined
        }
        tooltip={({ point }) => (
          <div 
            style={{
              background: "white", 
              padding: "8px", 
              borderRadius: "5px", 
              boxShadow: "0px 0px 6px rgba(0,0,0,0.2)",
              color: "black"
            }}
          >
            <strong>{point.data.x}</strong>: ₹{point.data.y.toLocaleString()} <br />
            {point.data.percentageChange !== null && (
              <span style={{ color: point.data.percentageChange >= 0 ? "green" : "red" }}>
                {point.data.percentageChange >= 0 ? "▲" : "▼"} {point.data.percentageChange}%
              </span>
            )}
          </div>
        )}
      />
</>
  );
};

export default OverviewChart;
