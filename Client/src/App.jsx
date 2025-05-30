import React, { useEffect } from "react";
import {  ThemeProvider } from "@mui/material";
import { CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { BrowserRouter, Routes, Navigate, Route } from "react-router-dom";

import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { connect } from "react-redux";
import { checkAuthenticated } from "./Redux/Counter/counterAction.jsx";
import "./App.css";
import { themeSettings } from "./theam";
import AttachBike from "./pages/Dashboard/Mybike/AttachBike";
import TeamInfoData from "./pages/Dashboard/team-management/TeamInfoData";
import Customer from "./pages/Dashboard/Customer-management/Customer";
import AddCustomer from "./pages/Dashboard/Customer-management/AddCustomer";
import AddTeamMember from "./pages/Dashboard/team-management/AddTeamMember";
import TodaysBusiness from "./pages/Dashboard/TodaysBusiness";
import EditBikes from "./pages/Dashboard/Mybike/EditBikes.jsx";
import Revenue from "./pages/Dashboard/Revenue.jsx";
import Revenue2 from "./pages/Dashboard/Revenue2.jsx";
import Login from "./pages/admin-auth/Login";
import AddBike from "./pages/Dashboard/Mybike/AddBike";
import Bikes from "./pages/Dashboard/Mybike/Bikes";
import AdminProfile from "./pages/Dashboard/AdminProfile.jsx";
import BikeUtility from "./pages/Dashboard/BikeUtility";
import DashBoard from "./pages/Dashboard/DashBoard.jsx";
import Bills from "./pages/Dashboard/Bills.jsx";
import BillData from "./pages/Dashboard/BillsData.jsx";
import Servicing from "./pages/Dashboard/Servicing.jsx";
import CustomerDue from "./pages/Dashboard/Customer-management/CustomerDue.jsx";
import CheckBill from "./pages/Dashboard/CheckBill.jsx";
import PayinMiddel from "./pages/Dashboard/Customer-management/PayinMiddel.jsx";
import Rental from "./pages/Dashboard/Customer-management/Rental.jsx";
import Cars from "./pages/Dashboard/car-management/Cars";
import EditCars from "./pages/Dashboard/car-management/EditCars";
import AddCars from "./pages/Dashboard/car-management/AddCars";
import CustomerHistory from "./pages/Dashboard/Customer-management/CustomerHistory";
import BatteryDashboard from "./pages/Dashboard/Delivery/BatteryDashboard.jsx";
import Battery from "./pages/Dashboard/Delivery/Battery.jsx";
import DeliveryBike from "./pages/Dashboard/Delivery/DeliveryBikes.jsx";
import DeliveryBoy from "./pages/Dashboard/Delivery/DeliveryBoy.jsx";
import LiveDeliveryBikeDashboard from "./pages/Dashboard/Delivery/LiveDeliveryBikeDashboard.jsx";
import DeliveryBikeUtility from "./pages/Dashboard/Delivery/DeliveryBikeUtility.jsx";
import Layout from "./components/Layout";
// Define allNavItems with lowercase paths
import Delivery_Revenue from "./pages/Dashboard/Delivery/Delivery_Revenue.jsx";

import DeliveryBikes from "./pages/Dashboard/Delivery/DeliveryBikes.jsx";
import BikeStatistics from "./pages/Dashboard/Mybike/BikeStatistics.jsx";
import DeliveryTodaysBusiness from "./pages/Dashboard/Delivery/DeliveryTodaysBusiness.jsx";
import EditTeamMember from "./pages/Dashboard/team-management/EditTeamMember.jsx";
import DueAmount from "./pages/Dashboard/Delivery/DueAmount.jsx";
import StaffActivity from "./pages/Dashboard/Delivery/StaffActivity.jsx";
import EditDeliveryBikes from "./pages/Dashboard/Delivery/EditDeliveryBikes.jsx";
const allNavItems = [
  { text: "Dashboard", path: "/dashboard", element: <DashBoard /> },
  { text: "Revenue", path: "/revenue", element: <Revenue /> },
  { text: "Customers", path: "/customers", element: <Customer /> },
  { text: "Bikes", path: "/bikes", element: <Bikes /> },
  { text: "Cars", path: "/cars", element: <Cars /> },
  {
    text: "Today's Business",
    path: "/todaysbusiness",
    element: <TodaysBusiness />,
  },
  { text: "Bike Utility", path: "/bikeutility", element: <BikeUtility /> },
  {
    text: "Bike Statistics",
    path: "/bikestatistics/:id/",
    element: <BikeStatistics />,
  },
  { text: "Servicing", path: "/servicing", element: <Servicing /> },
  { text: "Bills", path: "/bills", element: <BillData /> },
  { text: "Team Info", path: "/teaminfodata", element: <TeamInfoData /> },
  { text: "Admin Profile", path: "/adminprofile", element: <AdminProfile /> },
  { text: "Add Bike", path: "/addbike", element: <AddBike /> },
  { text: "Edit Bike", path: "/editbike/:id", element: <EditBikes /> },
  { text: "Attach Bike", path: "/attachbike", element: <AttachBike /> },
  { text: "Add Customer", path: "/addcustomer", element: <AddCustomer /> },
  {
    text: "Add Team Member",
    path: "/addteammember",
    element: <AddTeamMember />,
  },
  {
    text: "Edit Team Member",
    path: "/editteammember",
    element: <EditTeamMember />,
  },
  { text: "Customer Due", path: "/customer/:id", element: <CustomerDue /> },
  { text: "Payin Middle", path: "/customer/pay/:id", element: <PayinMiddel /> },
  {
    text: "Customer History",
    path: "/customerhistory",
    element: <CustomerHistory />,
  },
  { text: "Rental", path: "/rental/:id", element: <Rental /> },
  { text: "Edit Cars", path: "/editcars/:id", element: <EditCars /> },
  { text: "Add Cars", path: "/addcars", element: <AddCars /> },
  {
    text: "Delivery Bikes",
    path: "/deliverybikes",
    element: <DeliveryBikes />,
  },
  {
    text: "Delivery Bikes",
    path: "/deliverybikes/:id",
    element: <DeliveryBike />,
  },
  {
    text: "Delivery Revenue",
    path: "/deliveryrevenue",
    element: <Delivery_Revenue />,
  },

  {
    text: "Delivery Boy",
    path: "/deliveryboy",
    element: <LiveDeliveryBikeDashboard />,
  },
  {
    text: "Delivery Boy Details",
    path: "/deliveryboy/:id",
    element: <DeliveryBoy />,
  },
  {
    text: "Delivery Today's Buisness",
    path: "/deliverytodaysbusiness",
    element: <DeliveryTodaysBusiness />,
  },
  {
    text: "Delivery Bike Utility",
    path: "/deliverybikeutility",
    element: <DeliveryBikeUtility />,
  },
  {
    text: "Delivery Bike Edit",
    path: "/editdeliveryBike/:id",
    element: <EditDeliveryBikes/>,
  },
  {
    text: "Batterys",
    path: "/batterys",
    element: <BatteryDashboard />,
  },
  {
    text: "Due Amounts",
    path: "/dueamounts",
    element: <DueAmount />,
  },
  {
    text: "Staff Activitys",
    path: "/staffactivitys/:id",
    element: <StaffActivity />,
  },
  { text: "Battery Details", path: "/battery/:id", element: <Battery /> },
];



function AppContent({ checkAuthenticated }) {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/login") {
      sessionStorage.setItem("lastVisited", location.pathname);
      sessionStorage.setItem("lastState", JSON.stringify(location.state || {}));
    }
  }, [location]);

  const lastVisited = sessionStorage.getItem("lastVisited") || "/dashboard";
  const lastState = JSON.parse(sessionStorage.getItem("lastState") || "{}");

  useEffect(() => {
    checkAuthenticated();
  }, [checkAuthenticated]);

  const isAuthenticated = useSelector((state) => state.counter.isAuthenticated);
  const allowedContacts = ["6262302626", "7024949888"];
  const phone = useSelector((state) => state.counter.phone);
  const hasRevenueAccess = isAuthenticated && allowedContacts.includes(phone);

  const navItems = allNavItems.filter((item) =>
    item.text === "Revenue" ? hasRevenueAccess : true
  );

  const mode = useSelector((state) => state.global.mode);
  const theme = React.useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <>
      <CssBaseline />
      {/* <ThemeProvider theme={theme}> */}
      <Routes>
  {isAuthenticated ? (
    <Route element={<Layout hasRevenueAccess={hasRevenueAccess} />}>
      {/* Always redirect root ("/") to "/dashboard" */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {navItems.map((item, index) => (
        <Route
          key={index}
          path={item.path}
          element={
            item.path === "/dashboard" || item.path === "/bikes"
              ? React.cloneElement(item.element, { hasRevenueAccess })
              : item.element
          }
        />
      ))}

      <Route path="/revenue2" element={<Revenue2 />} />
      <Route path="/bills/:id/:id" element={<Bills />} />
      <Route path="/bills/:id/:id/check" element={<CheckBill />} />

      {/* Redirect unknown paths to last visited page */}
      <Route path="*" element={<Navigate to={lastVisited} state={lastState} replace />} />
    </Route>
  ) : (
    <>
      {/* If not authenticated, force redirect to login */}
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </>
  )}
</Routes>

      {/* </ThemeProvider> */}
    </>
  );
}

function App(props) {
  return (
    <BrowserRouter>
      <AppContent {...props} />
    </BrowserRouter>
  );
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.counter.isAuthenticated,
});

export default connect(mapStateToProps, { checkAuthenticated })(App);

