import React from "react";

import { Box, Typography, useTheme } from "@mui/material";

import { ResponsivePie } from "@nivo/pie";
const generateRandomPieData = (delivery, ev, petrol) => {
  return [
    {
      id: "Delivery Bikes",
      label: "Delivery Bikes",
      value: delivery,
    },
    {
      id: "Electric Bikes",
      label: "Electric Bikes",
      value: ev,
    },
    {
      id: "Petrol Bikes",
      label: "Petrol Bikes",
      value: petrol,
    },
  ];
};
const BreakdownChart = ({
  isDashboard = false,
  delivery,
  ev,
  petrol,
  total,
}) => {
  const isLoading = false;
  const theme = useTheme();
  const data = generateRandomPieData(delivery, ev, petrol);

  if (!data || isLoading) return "Loading...";

  const colors = [
    theme.palette.secondary?.[500] || "#ff6384",
    theme.palette.secondary?.[300] || "#36a2eb",
    theme.palette.secondary?.[300] || "#ffcd56",
    theme.palette.secondary?.[500] || "#4bc0c0",
  ];

  const formattedData = data.map((item, i) => ({
    ...item,
    color: colors[i % colors.length], // Assign a color safely
  }));

  return (
    <Box
      height={isDashboard ? "400px" : "100%"}
      width={undefined}
      minHeight={isDashboard ? "325px" : undefined}
      minWidth={isDashboard ? "325px" : undefined}
      position="relative"
    >
      <ResponsivePie
        data={formattedData}
  
        theme={{
          labels: {
            text: {
              fontSize: 16, // ✅ Make labels bigger
              fontWeight: "bold",
            },
          },
          axis: {
            domain: {
              line: {
                stroke: theme.palette.secondary[200],
              },
            },
            legend: {
              text: {
                fill: theme.palette.secondary[200],
              },
            },
            ticks: {
              line: {
                stroke: theme.palette.secondary[200],
                strokeWidth: 1,
              },
              text: {
                fill: theme.palette.secondary[200],
              },
            },
          },
          legends: {
            text: {
              fill: theme.palette.secondary[200],
            },
          },
          tooltip: {
            container: {
              color: theme.palette.primary.main,
            },
          },
        }}
        colors={{ datum: "data.color" }}
        margin={
          isDashboard
            ? { top: 40, right: 80, bottom: 100, left: 50 }
            : { top: 40, right: 80, bottom: 80, left: 80 }
        }
        valueFormat={(value) => `₹${value.toLocaleString()}`}
        sortByValue={true}
        innerRadius={0.45}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        enableArcLinkLabels={!isDashboard}
        tooltip={({ datum }) => (
          <div
            style={{
              background: "white",
              padding: "5px 10px",
              borderRadius: "5px",
              border: `1px solid ${datum.color}`,
              color: "black",
            }}
          >
            <strong>{datum.id}:</strong> ₹{datum.value.toLocaleString()}
          </div>
        )}
        
        arcLinkLabelsTextColor={theme.palette.secondary[200]}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        
 
        arcLabelsRadiusOffset={1.5} 
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}        
        
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateX: isDashboard ? 20 : 0,
            translateY: isDashboard ? 50 : 56,
            itemsSpacing: 0,
            itemWidth: 115,
            itemHeight: 18,
            itemTextColor: "#999",
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: theme.palette.primary[500],
                },
              },
            ],
          },
        ]}
      />
      <Box
        position="absolute"
        top="43.4%"
        left="46%"
        color={theme.palette.secondary[400]}
        textAlign="center"
        pointerEvents="none"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{
          transform: "translate(-50%, -50%)",
          width: "100px",
        }}
      >
        <Typography fontWeight="bold" sx={{ fontSize: "16px" }}>
          ₹{total}
        </Typography>
        {!isDashboard && (
          <Typography variant="subtitle2">Total Sales</Typography>
        )}
      </Box>
    </Box>
  );
};

export default BreakdownChart;
