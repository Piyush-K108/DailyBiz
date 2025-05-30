import React, { useEffect, useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineElectricMoped } from "react-icons/md";
import {
  SettingsOutlined,
  ChevronLeft,
  ChevronRightOutlined,
  MopedOutlined,
  CurrencyRupeeRounded
} from "@mui/icons-material";
import { Car, Delivery } from "../Redux/Counter/counterAction";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import profileImage from "../assets/user.jpeg";
import scrollReveal from "scrollreveal"; // Import scrollReveal

import {
  Dashboard as DashboardIcon,
  AttachMoney as RevenueIcon,
  People as CustomersIcon,
  TwoWheeler as BikesIcon,
  DirectionsCar as CarsIcon,
  Today as TodaysBusinessIcon,
  Build as BikeUtilityIcon,
  Handyman as ServicingIcon,
  Receipt as BillsIcon,
  Groups as TeamInfoIcon,
} from "@mui/icons-material";

const Sidebar = ({
  user,
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
  hasRevenueAccess,
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();

  // Filter navItems based on hasRevenueAccess
  const navItems = allNavItems.filter((item) => {
    if (item.text === "Revenue") {
      return hasRevenueAccess;
    }
    return true;
  });
  const navItemsdelivery = allNavItemsDelivery.filter((item) => {
    if (item.text === "Delivery Revenue") {
      return hasRevenueAccess;
    }
    return true;
  });

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  // Initialize scrollReveal animations
  const car = useSelector((state) => state.counter.car);
  const delivery = useSelector((state) => state.counter.delivery);
  useEffect(() => {
    if (isSidebarOpen) {
      const sr = scrollReveal({
        origin: "left",
        distance: "20px",
        duration: 1000,
        delay: 200,
        reset: false,
      });

      // Target each navigation item
      sr.reveal(".nav-item", {
        interval: 100, // Delay between animations
      });
    }
  }, [isSidebarOpen,car,delivery]);
  const handleClick = () => {
    if (!car && !delivery) {
      dispatch(Car(true)); // Set car to true
    } else if (car) {
      dispatch(Car(false)); // Set car to false
      dispatch(Delivery(true)); // Set delivery to true
    } else {
      dispatch(Delivery(false)); // Reset both to false
    }

    console.log(car, "->", delivery);
  };
  return (
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              display: "flex",
              flexDirection: "column",
              height: "100vh", // Full height of the viewport
              justifyContent: "space-between", // Pushes content to top and bottom
              color: "#fff",
              backgroundColor: "#000",
              boxSizing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
            },
            "& .MuiSvgIcon-root": {
              color: "#fff",
            },
          }}
        >
          <Box width="100%">
            <Box m="2.5rem 2rem 2rem 3rem">
              <FlexBetween color={theme.palette.secondary.main}>
                <Box display="flex" alignItems="center" gap="0.5rem">
                  <Typography
                    onDoubleClick={handleClick}
                    variant="h6"
                    sx={{
                      color: "#eab308",
                      fontSize: !delivery?"1.55rem":"1.2725rem",
                      fontWeight: "bold",
                      userSelect: 'none',
                    }}
                  >
                    {!delivery?"AiRYY ADMIN":"AiRYY DELIVERY"}
                  </Typography>
                </Box>
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <ChevronLeft />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>

            {/* Scrollable List */}
            <Box
              sx={{
                flexGrow: 1,
                overflowY: "auto", // Enable vertical scrolling
                height: "calc(100vh - 200px)", 
              }}
            >
              {delivery ? (
                <List>
                  {navItemsdelivery.map(({ text, icon, path }) => {
                    if (!icon) {
                      return (
                        <Typography
                          key={text}
                          sx={{ m: "2.25rem 0 1rem 3rem" }}
                        >
                          {text}
                        </Typography>
                      );
                    }
                    const lcText = text.toLowerCase();

                    return (
                      <ListItem key={text} disablePadding className="nav-item">
                        <ListItemButton
                          onClick={() => {
                            setActive(lcText);
                            navigate(path);
                          }}
                          sx={{
                            backgroundColor:
                              active === lcText ? "#eab308" : "transparent",
                            color:
                              active === lcText
                                ? theme.palette.primary[600]
                                : theme.palette.secondary[100],
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              ml: "1rem",
                              color:
                                active === lcText
                                  ? theme.palette.primary[600]
                                  : theme.palette.secondary[200],
                            }}
                          >
                            {icon}
                          </ListItemIcon>
                          <ListItemText primary={text} />
                          {active === lcText && (
                            <ChevronRightOutlined sx={{ ml: "auto" }} />
                          )}
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
              ) : (
                <List>
                  {navItems.map(({ text, icon, path }) => {
                    if (!icon) {
                      return (
                        <Typography
                          key={text}
                          sx={{ m: "2.25rem 0 1rem 3rem" }}
                        >
                          {text}
                        </Typography>
                      );
                    }
                    const lcText = text.toLowerCase();

                    return (
                      <ListItem key={text} disablePadding className="nav-item">
                        <ListItemButton
                          onClick={() => {
                            setActive(lcText);
                            navigate(path);
                          }}
                          sx={{
                            backgroundColor:
                              active === lcText ? "#eab308" : "transparent",
                            color:
                              active === lcText
                                ? theme.palette.primary[600]
                                : theme.palette.secondary[100],
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              ml: "1rem",
                              color:
                                active === lcText
                                  ? theme.palette.primary[600]
                                  : theme.palette.secondary[200],
                            }}
                          >
                            {icon}
                          </ListItemIcon>
                          <ListItemText primary={text} />
                          {active === lcText && (
                            <ChevronRightOutlined sx={{ ml: "auto" }} />
                          )}
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
              )}
            </Box>
          </Box>

          {/* Bottom Section */}
          <Box
            sx={{ marginLeft: "1rem" }}
            p="1rem"
            borderTop={`1px solid ${theme.palette.secondary[300]}`}
          >
            <FlexBetween textTransform="none" gap="1rem">
              <Box
                component="img"
                alt="profile"
                src={user.ProfilePic || profileImage}
                height="40px"
                width="40px"
                borderRadius="50%"
                sx={{ objectFit: "cover" }}
                zIndex={1}
              />
              <Box textAlign="left">
                <Typography
                  fontWeight="bold"
                  fontSize="0.9rem"
                  sx={{ color: theme.palette.secondary[100] }}
                >
                  {user.name}
                </Typography>
                <Typography
                  fontSize="0.8rem"
                  sx={{ color: theme.palette.secondary[200] }}
                >
                  {user.City}
                </Typography>
              </Box>
              <SettingsOutlined
                sx={{
                  color: theme.palette.secondary[300],
                  fontSize: "25px ",
                }}
              />
            </FlexBetween>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;

const allNavItems = [
  {
    text: "Dashboard",
    icon: <DashboardIcon />,
    path: "/dashboard",
  },
  {
    text: "Revenue",
    icon: <RevenueIcon />,
    path: "/revenue",
  },
  {
    text: "Customers",
    icon: <CustomersIcon />,
    path: "/customers",
  },
  {
    text: "Bikes",
    icon: <BikesIcon />,
    path: "/bikes",
  },

  {
    text: "Today's Business",
    icon: <TodaysBusinessIcon />,
    path: "/todaysbusiness",
  },
  {
    text: "Bike Utility",
    icon: <BikeUtilityIcon />,
    path: "/bikeutility",
  },
  {
    text: "Servicing",
    icon: <ServicingIcon />,
    path: "/servicing",
  },
  {
    text: "Bills",
    icon: <BillsIcon />,
    path: "/bills",
  },
  {
    text: "Team Info",
    icon: <TeamInfoIcon />,
    path: "/teaminfodata",
  },
];


import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';

const allNavItemsDelivery = [
  {
    text: "Dashboard",
    icon: <DashboardIcon />, // Correct icon for Dashboard
    path: "/dashboard",
  },
  {
    text: "Delivery Revenue",
    icon: <RevenueIcon />, 
    path: "/deliveryrevenue",
  },
  {
    text: "Delivery Boy",
    icon: <DeliveryDiningIcon />, // Correct icon for Delivery Boy
    path: "/deliveryboy",
  },
  {
    text: "Delivery Bikes",
    icon: <TwoWheelerIcon />, // Correct icon for Delivery Bikes
    path: "/deliverybikes",
  },
  {
    text: "Today's Business",
    icon: <TodaysBusinessIcon />, // Correct icon for Delivery Bikes
    path: "/deliverytodaysbusiness",
  },
  {
    text: "Batterys",
    icon: <BatteryChargingFullIcon />, // Correct icon for Batterys
    path: "/batterys",
  },
  {
    text: "Due Amount",
    icon: <CurrencyRupeeRounded />,
    path: "/dueamounts",
  },
 
];