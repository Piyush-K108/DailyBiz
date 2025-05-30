import React, { useState ,useEffect} from "react";
import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
// import { useGetUserQuery } from "state/api";
import { API_URL } from "../../config";
const Layout = ({hasRevenueAccess}) => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const delivery = useSelector((state) => state.counter.delivery);
  const car = useSelector((state) => state.counter.car);
  const [adminData,setadminData] = useState([]) 
  const phone = useSelector((state) => state.counter.phone);
  useEffect(() => {
    fetchData();
    // fetchTotalRides();
  }, []);

  // const fetchTotalRides = () => {
  //   axios
  //     .get(`http://${API_URL}/Admin/rentaltotal/`)
  //     .then((response) => {
  //       setTotalRides(response.data.data);
  //     })
  //     .catch((error) => {
  //       console.log("Error fetching total rides:", error);
  //     });
  // };

  const fetchData = () => {
    fetch(`http://${API_URL}/Admin/admin-data/`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((responseJson) => {
        const filteredData = responseJson.filter(
          (admin) => parseInt(admin.phone) === parseInt(phone)
        );
        setadminData(filteredData[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  };
 
  return (
    <Box display={isNonMobile ? "flex" : "block"} width="100%" height="100%">
      <Sidebar
        user={adminData || {}}
        isNonMobile={isNonMobile}
        drawerWidth="250px"
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        hasRevenueAccess={hasRevenueAccess}
      />
      <Box flexGrow={1}>
        <Navbar
          user={adminData || {}}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
