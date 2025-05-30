import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import FlexBetween from "./FlexBetween";
import { PiCurrencyInr } from "react-icons/pi";

const StatBox = ({ title, value, increase, icon, description,icon2 }) => {
  const theme = useTheme();
  return (
    <Box
      gridColumn="span 2"
      gridRow="span 1"
      className="hover:bg-black hover:text-yellow-400 group-hover:text-yellow-400 transition duration-800 ease-in-out transform hover:scale-105"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      p="1.25rem 1rem"
      flex="1 1 100%"
      backgroundColor={"#eab308"}
      borderRadius="0.55rem"
    >
      <FlexBetween>
        <Typography sx={{ color: theme.palette.secondary[100] }}>
          {title}
        </Typography>

        {icon2 === "RS" ? (
          <div className="group-hover:text-yellow-400 ml-10 mt-2 items-center hover:text-yellow-400 text-2xl sm:text-3xl">
            <PiCurrencyInr />
          </div>
        ) : (
          <div className="group-hover:text-yellow-400 items-center ml-4 hover:text-yellow-400 text-2xl sm:text-3xl">
            {icon}
          </div>
        )}
      </FlexBetween>

      <Typography
        variant="h6"
        fontWeight="600"
        sx={{ color: theme.palette.secondary[200] }}
      >
        {value}
      </Typography>
      <FlexBetween gap="1rem">
        <Typography
          variant="h5"
          fontStyle="italic"
          sx={{ color: theme.palette.secondary.light }}
        >
          {increase}
        </Typography>
        <Typography>{description}</Typography>
      </FlexBetween>
    </Box>
  );
};

export default StatBox;
