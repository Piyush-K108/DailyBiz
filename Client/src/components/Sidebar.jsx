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
  CurrencyRupeeRounded,
} from "@mui/icons-material";
import { Car, Delivery } from "../Redux/Counter/counterAction";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import profileImage from "../assets/user.jpeg";
import scrollReveal from "scrollreveal"; // Import scrollReveal

import {
  Dashboard as DashboardIcon,
  People as CustomersIcon,
  Store as VendorsIcon,
  Inventory2 as ProductsIcon,
  ShoppingCart as PurchaseIcon,
  PointOfSale as SalesIcon,
  AccountBalance as LedgerIcon,
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
  const navItemsdelivery = allNavItems.filter((item) => {
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
  }, [isSidebarOpen, car, delivery]);
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
              height: "100vh",
              justifyContent: "space-between",
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
          {/* Top Logo & Close Icon */}
          <Box width="100%">
            <Box px={3} pt={4} pb={2}>
              <FlexBetween color={theme.palette.secondary.main}>
                <Box display="flex" alignItems="center" gap="0.5rem">
                  <Typography
                    onDoubleClick={handleClick}
                    variant="h6"
                    sx={{
                      color: "#eab308",
                      fontSize: delivery ? "1.25rem" : "2rem",
                      fontWeight: "bold",
                      userSelect: "none",
                    }}
                  >
                    DAILYBIZ
                  </Typography>
                </Box>
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(false)}>
                    <ChevronLeft />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>

            {/* Scrollable Nav Items */}
            <Box sx={{ flex: 1, overflowY: "auto", px: 1 }}>
              <List>
                {(delivery ? navItemsdelivery : navItems).map(
                  ({ text, icon, path }) =>
                    icon ? (
                      <ListItem key={text} disablePadding>
                        <ListItemButton
                          onClick={() => {
                            setActive(text.toLowerCase());
                            navigate(path);
                          }}
                          sx={{
                            backgroundColor:
                              active === text.toLowerCase()
                                ? "#eab308"
                                : "transparent",
                            borderRadius: "8px",
                            mx: 1,
                            my: 1,

                            "&:hover": {
                              backgroundColor: "#666",
                            },
                          }}
                        >
                          <ListItemIcon>
                            {React.cloneElement(icon, {
                              style: { color: active != text.toLowerCase() ? "#FFF" : "#000" },
                            })}
                          </ListItemIcon>

                          <ListItemText
                            primary={text}
                            primaryTypographyProps={{
                              fontSize: "1.2rem",
                              fontWeight: "500",
                           
                              color: active != text.toLowerCase() ? "#FFF" : "#000",
                              textShadow: "0 0 4px rgba(255, 255, 255, 0.3)",
                            }}
                          />

                          {active === text.toLowerCase() && (
                            <ChevronRightOutlined sx={{ ml: "auto" }} />
                          )}
                        </ListItemButton>
                      </ListItem>
                    ) : (
                      <Typography
                        key={text}
                        sx={{
                          m: "1.5rem 0 1rem 2rem",
                          fontSize: "0.875rem",
                          color: "#aaa",
                        }}
                      >
                        {text}
                      </Typography>
                    )
                )}
              </List>
            </Box>
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
    text: "Customers",
    icon: <CustomersIcon />,
    path: "/customers",
  },
  {
    text: "Vendors",
    icon: <VendorsIcon />,
    path: "/vendors",
  },
  {
    text: "Products",
    icon: <ProductsIcon />,
    path: "/products",
  },
  {
    text: "Purchase",
    icon: <PurchaseIcon />,
    path: "/purchase",
  },
  {
    text: "Sales",
    icon: <SalesIcon />,
    path: "/sales",
  },
  {
    text: "Ledger",
    icon: <LedgerIcon />,
    path: "/ledger",
  },
];
