import React, { useState, useEffect } from "react";
import {
  Menu as MenuIcon,
  Search,
  SettingsOutlined,
  ArrowDropDownOutlined,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import FlexBetween from "../components/FlexBetween";
import { useDispatch } from "react-redux";
import {
  AppBar,
  Button,
  Box,
  Typography,
  IconButton,
  InputBase,
  Toolbar,
  Menu,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import axios from "axios";
import { logout } from "../Redux/Counter/counterAction";
import profileImage from "../assets/user.jpeg";
import scrollReveal from "scrollreveal";
import useCheckAccess from "./CheckAccess";


const Navbar = ({ user, isSidebarOpen, setIsSidebarOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  
  const phone = useSelector((state) => state.counter.phone);
  const hasAccess = useCheckAccess();
  const [selectedFile, setSelectedFile] = useState(null);
  const [Typed, setTyped] = useState("");

  const handleClose = () => {
    setAnchorEl(null);
    dispatch(logout());
    navigate("/");
  };

  // Initialize ScrollReveal
  useEffect(() => {
    const sr = scrollReveal({
      origin: "left",
      distance: "80px",
      duration: 1000,
      reset: false,
    });

    // Target elements directly using class names
    sr.reveal(
      `
        .navbar-left,
        .navbar-right,
        .search-bar,
        .profile-button,
        .menu-icon
      `,
      {
        opacity: 0,
        interval: 300,
      }
    );
  }, []);

  const handleChangeData = async () => {
    const file = selectedFile;
    try {
      let config;

      config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const DATA = new FormData();
      DATA.append("ProfilePic", file);

      console.log(DATA);

      const response = await axios.put(
        `http://${API_URL}/User/Profile/${phone}/`,
        DATA,
        config
      );
      console.log(response.data);
      if (response.status === 200) {
        alert("Upload successful!");
        window.location.reload(); // Refresh after successful upload
      }
    } catch (error) {
      console.error("Error updating profile: Select Again", error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleKeyPress = async (e) => {
    console.log("Find",hasAccess)
    if (e.key === "Enter") {
      if (Typed.length === 10) {
        navigate(`Customer/${Typed}`, {
          state: {
            Data: { phone: Typed },
            Amount: 0,
            r_id: "Null",
          },
        });
      } else if (Typed.startsWith("BAT")) {
        navigate(`/Battery/${Typed}`, {
          state: {
            battery_id: Typed,
          },
        });
      } 
      else if (Typed.toLowerCase().startsWith("bike")) {
        const bikeId = Typed.replace(/bike\s*/i, ""); 
        navigate(`/bikestatistics/${bikeId}/`, {
          state: {
            bikeId: bikeId,
          },
        });
      }
      
      
      else if (Typed.length < 10 && hasAccess) {
        navigate(`Rental/${Typed}/`, {
          state: {
            id: Typed,
          },
        });
      }
    }
  };

  return (
    <AppBar
      sx={{
        position: "static",
        background: "none",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* LEFT SIDE */}
        <FlexBetween className="navbar-left">
          <IconButton
            className="menu-icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <MenuIcon />
          </IconButton>
          <FlexBetween
            className="search-bar"
            backgroundColor={"#fff"}
            borderRadius="9px"
            gap="3rem"
            p="0.1rem 1.5rem"
          >
            <InputBase
              placeholder="Search..."
              value={Typed}
              onChange={(e) => setTyped(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <IconButton onClick={handleKeyPress}>
              <Search />
            </IconButton>
          </FlexBetween>
        </FlexBetween>

        {/* RIGHT SIDE */}
        <FlexBetween className="navbar-right" gap="1.5rem">
          <IconButton>
            <SettingsOutlined sx={{ fontSize: "25px" }} />
          </IconButton>

          <FlexBetween>
            <Button
              className="profile-button"
              onClick={handleClick}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                textTransform: "none",
                gap: "1rem",
              }}
            >
              <Box
                component="img"
                alt="profile"
                src={user.ProfilePic || profileImage}
                height="32px"
                width="32px"
                borderRadius="50%"
                sx={{ objectFit: "cover" }}
              />
              <Box textAlign="left">
                <Typography
                  fontWeight="bold"
                  fontSize="0.85rem"
                  sx={{ color:"#F2C464"  }}
                >
                  {user.name || "Admin"}
                </Typography>
                <Typography
                  fontSize="0.75rem"
                  sx={{ color:"#F2C464"  }}
                >
                  {user.City || "Update IT"}
                </Typography>
              </Box>
              <ArrowDropDownOutlined
                sx={{ color: [300], fontSize: "25px" }}
              />
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={isOpen}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <MenuItem onClick={() => navigate("/adminprofile")}>
                Profile
              </MenuItem>
              <MenuItem onClick={() => navigate("/adminprofile")}>
                Upload Pic
              </MenuItem>
              <MenuItem onClick={() => navigate("/adminprofile")}>
                Attach Bike?
              </MenuItem>
              <MenuItem onClick={handleClose}>Log Out</MenuItem>
            </Menu>
          </FlexBetween>
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;