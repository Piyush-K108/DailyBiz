import React, { useState, useEffect } from "react";
import FlexBetween from "../../components/FlexBetween";
import Header from "../../components/Header";

import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Tabs,
  Tab,
} from "@mui/material";
import {
  DownloadOutlined,
  TwoWheeler,
  People,
  DeliveryDining,
  ShoppingCart,
  AttachMoney,
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import StatBox from "../../components/StatBox";
import OverviewChart from "../../components/Charts/OverviewChart";
import BreakdownChart from "../../components/Charts/BreakdownChart";
import { API_URL } from "../../config";
import axios from "axios";

const columns = [
  { id: "rank", label: "Rank" },
  { id: "name", label: "Name" },
  { id: "phone", label: "Phone" },
  { id: "email", label: "Email" },
  { id: "city", label: "City" },
  { id: "revenue", label: "Revenue" },
  { id: "usercount", label: "Rentals" },
];

const Dashboard = ({ hasRevenueAccess }) => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalBikes, setTotalBikes] = useState(0);
  const [totalRentals, setTotalRentals] = useState(0);
  const [todaysRevenue, setTodaysRevenue] = useState(0);
  const [totalDeliveryBoys, setTotalDeliveryBoys] = useState(0);
  const [totalDeliveryBikes, setTotalDeliveryBikes] = useState(0);

  const [petrolrevenue, setpetrolrevenue] = useState(0);
  const [evrevenue, setevrevenue] = useState(0);
  const [deliveryrevenue, setdeliveryrevenue] = useState(0);

  const [UsersRevenue, setUsersRevenue] = useState([]);
  const [DeliveryBoyRevenue, setDeliveryBoyRevenue] = useState([]);

  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(1);
    console.log(hasRevenueAccess);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const currentData = tabValue === 1 ? UsersRevenue : DeliveryBoyRevenue;
  const totalPages = Math.ceil(currentData.length / rowsPerPage);

  const displayedData = currentData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const fetchData = async () => {
    try {
      const [
        { data: rentalData },
        { data: stateData },
        { data: bikesRevenueData },
        { data: UsersRevenueData },
      ] = await Promise.all([
        axios.get(`http://${API_URL}/Admin/rentaltotal/`),
        axios.get(`http://${API_URL}/Admin/StateDate/`),
        axios.get(`http://${API_URL}/Admin/all-bikes-revenue/`),
        axios.get(`http://${API_URL}/Admin/all-users-revenue/`),
      ]);

      if (!bikesRevenueData || Object.keys(bikesRevenueData).length === 0) {
        throw new Error("Bikes Revenue Data is empty or undefined");
      }

      setTotalRentals(rentalData.data);
      setTotalUsers(stateData.total_users);
      setTotalBikes(stateData.total_bikes);
      setTotalDeliveryBoys(stateData.total_delivery_boys);
      setTotalDeliveryBikes(stateData.total_delivery_bikes);
      setTodaysRevenue(stateData.today_revenue);
      setevrevenue(bikesRevenueData.EV);
      setdeliveryrevenue(bikesRevenueData.Delivery);
      setpetrolrevenue(bikesRevenueData.Petrol);
      setUsersRevenue(UsersRevenueData.top_normal_customers);
      setDeliveryBoyRevenue(UsersRevenueData.top_delivery_boys);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetch_Month_Data = async () => {
    try {
      const response = await fetch(`http://${API_URL}/Admin/MixMonthlyR2/`);
      const responseJson = await response.json();

      // Format API response to match expected chart data structure
      const formattedData = responseJson.map((item) => ({
        month: item.month,
        totalAmount: item.totalAmount,
      }));

      setChartData(formattedData);
    } catch (error) {
      console.error("Error fetching monthly data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetch_Month_Data();
  }, []);

  useEffect(() => {
    if (!hasRevenueAccess) {
      columns.splice(5, 1); 
    }
  }, [hasRevenueAccess]);

  return (
    <Box m="1.5rem 2.5rem " color="#000">
      <FlexBetween>
        <Header subtitle="Welcome to your Dashboard" />

        <Button
          sx={{
            backgroundColor: "#eab308",
            color: "#000",
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
            textTransform: "none",
            borderRadius: "8px",
            "&:hover": { backgroundColor: "#d19f07" },
          }}
        >
          <DownloadOutlined sx={{ mr: "10px" }} /> Download Reports
        </Button>
      </FlexBetween>

      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="160px"
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
        <StatBox
          title="Users & Delivery Boys"
          value={totalUsers + totalDeliveryBoys}
          values={[
            { label: "Customers", value: totalUsers },
            { label: "Delivery Boys", value: totalDeliveryBoys },
          ]}
          icon={<People />}
        />

        <StatBox
          title="Total Bikes & Delivery Bikes"
          value={totalBikes + totalDeliveryBikes}
          values={[
            { label: "Total Bikes", value: totalBikes },
            { label: "Assigned to Delivery", value: totalDeliveryBikes },
          ]}
          icon={<TwoWheeler />}
        />

        <Box
          gridColumn="span 8"
          gridRow="span 2"
          bgcolor="#fff"
          p="1rem"
          borderRadius="8px"
          boxShadow={2}
        >
          <OverviewChart view="sales" isDashboard={true} data={chartData}  hasRevenueAccess={hasRevenueAccess}/>
        </Box>

        <StatBox
          title="Total Rentals"
          value={totalRentals}
          icon={<DeliveryDining />}
        />
        <StatBox
          title="Sales Today"
          value={`₹${todaysRevenue}`}
          icon={<AttachMoney />}
        />

        <Box
          p="0.7rem"
          borderRadius="8px"
          boxShadow={2}
          sx={{
            overflow: "hidden",
            transition: "box-shadow 0.3s ease-in-out",

            "&:hover": {
              boxShadow: "0px 4px 20px rgba(247, 209, 23, 0.5)", // Yellow shadow on hover
            },
          }}
          gridColumn="span 8"
          gridRow="span 3"
        >
          <FlexBetween>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              TabIndicatorProps={{
                style: { backgroundColor: "#F7D117", marginBottom: 2 }, // Change the indicator color to yellow
              }}
              sx={{
                "& .MuiTab-root.Mui-selected": {
                  color: "#000", // Black text for selected tab
                  fontWeight: "bold", // Bold text for selected tab
                },
              }}
            >
              <Tab label="Delivery Boys" />
              <Tab label="Users" />
            </Tabs>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                sx={{
                  "& .MuiButtonBase-root.MuiPaginationItem-root.Mui-selected": {
                    backgroundColor: "#F7D117", // Yellow background for selected page
                    color: "#000", // Black text for selected page
                    "&:hover": {
                      backgroundColor: "#E6B800", // Darker yellow on hover
                    },
                  },
                  "& .MuiButtonBase-root.MuiPaginationItem-root": {
                    "&:hover": {
                      backgroundColor: "#F7D117", // Yellow background on hover
                      color: "#000", // Black text on hover
                    },
                  },
                }}
              />
            </Box>
          </FlexBetween>

          <TableContainer component={Paper}>
            <Table sx={{}}>
              <TableHead>
                <TableRow className="bg-[#F7D117]">
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      sx={{
                        color: "#000",
                        fontWeight: "bold",
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedData.map((row, index) => (
                  <TableRow key={row.id}>
                    {columns.map((column) => (
                      <TableCell key={column.id}>
                        {column.id === "rank" ? index + 1 : row[column.id]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 3"
          bgcolor="#fff"
          p="1.5rem"
          borderRadius="8px"
          boxShadow={2}
        >
          <Typography variant="h6" sx={{ color: "#000" }}>
            Revenue By Bikes
          </Typography>
          <BreakdownChart
            isDashboard={true}
            petrol={hasRevenueAccess?petrolrevenue:0}
            ev={hasRevenueAccess?evrevenue:0}
            total={hasRevenueAccess?petrolrevenue + evrevenue + deliveryrevenue:0}
            delivery={hasRevenueAccess?deliveryrevenue:0}
          />
          <Typography p="0 0.6rem" fontSize="0.8rem" sx={{ color: "#555" }}>
            Breakdown of revenue and total sales by category for this year.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
