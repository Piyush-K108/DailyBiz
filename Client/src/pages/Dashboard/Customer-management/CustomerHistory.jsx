import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
  Button,
} from "@mui/material";
import { API_URL } from "../../../config";
const CustomerHistory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { Data, phone } = location.state;

  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const historyResponse = await fetch(
          `http://${API_URL}/User/history/${phone}/`
        );
        if (!historyResponse.ok) {
          throw new Error("Failed to fetch history data");
        }
        const historyJson = await historyResponse.json();
        setHistoryData(historyJson.Data);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [phone]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress sx={{ color: "#eab308" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Typography variant="h6" color="error" align="center">
          Error: {error}
        </Typography>
      </Box>
    );
  }
  const handleClick = async (selectedDate) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://${API_URL}/Admin/Todays_Revenu_Exel/${selectedDate}/`
      );
      const response2 = await fetch(
        `http://${API_URL}/Admin/Exel_User/${selectedDate}/`
      );
      const response_data = await response.json();
      const response_data2 = await response2.json();
      let index;
      try {
         index = response_data2.findIndex((item) => item.phone === phone);
      } catch (err) {
        alert("Its Was Persnal Use no rental information");
      }

      navigate(`/Bills/${phone}/${selectedDate}/`, {
        state: {
          phone: phone,
          date: selectedDate,
          Data: response_data[index] || response_data[0],
          index: index || 0,
        },
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Box
      sx={{
        padding: 3,
        backgroundColor: "#ffffff",
        color: "#000000",
        minHeight: "100vh",
      }}
    >
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#eab308",
          color: "#000000",
          marginBottom: 2,
          "&:hover": { backgroundColor: "#d39e00" },
        }}
        onClick={() => navigate(-1)}
      >
        Back
      </Button>

      {Data && (
        <Box mb={4}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ color: "#eab308", fontWeight: "bold" }}
          >
            Customer Details
          </Typography>
          <Box sx={{ backgroundColor: "#f5f5f5", padding: 2, borderRadius: 2 }}>
            <Typography variant="body1" sx={{ color: "#000000" }}>
              <strong>Name:</strong> {Data.name}
            </Typography>
            <Typography variant="body1" sx={{ color: "#000000" }}>
              <strong>Email:</strong> {Data.email}
            </Typography>
            <Typography variant="body1" sx={{ color: "#000000" }}>
              <strong>Phone:</strong> {phone}
            </Typography>
            <Typography variant="body1" sx={{ color: "#000000" }}>
              <strong>City:</strong> {Data.City}
            </Typography>
          </Box>
        </Box>
      )}

      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: "#eab308", fontWeight: "bold" }}
      >
        Rental History
      </Typography>
      {historyData.length === 0 ? (
        <Typography variant="body1" sx={{ color: "#000000" }}>
          No rental history found for this customer.
        </Typography>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ backgroundColor: "#f5f5f5", overflowX: "auto" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#eab308", fontWeight: "bold" }}>
                  Bike ID
                </TableCell>
                <TableCell sx={{ color: "#eab308", fontWeight: "bold" }}>
                  Amount
                </TableCell>
                <TableCell sx={{ color: "#eab308", fontWeight: "bold" }}>
                  Rental Date
                </TableCell>
                <TableCell sx={{ color: "#eab308", fontWeight: "bold" }}>
                  Return Date
                </TableCell>
                <TableCell sx={{ color: "#eab308", fontWeight: "bold" }}>
                  Rental Time
                </TableCell>
                <TableCell sx={{ color: "#eab308", fontWeight: "bold" }}>
                  Return Time
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {historyData.map((history, index) => (
                <TableRow
                  onDoubleClick={() => handleClick(history.return_date)}
                  key={index}
                  sx={{ "&:hover": { backgroundColor: "#eaeaea" } }}
                >
                  <TableCell sx={{ color: "#000000" }}>
                    {history.bike_id}
                  </TableCell>
                  <TableCell sx={{ color: "#000000" }}>
                    {history.Amount}
                  </TableCell>
                  <TableCell sx={{ color: "#000000" }}>
                    {history.rental_date}
                  </TableCell>
                  <TableCell sx={{ color: "#000000" }}>
                    {history.return_date}
                  </TableCell>
                  <TableCell sx={{ color: "#000000" }}>
                    {history.rental_time}
                  </TableCell>
                  <TableCell sx={{ color: "#000000" }}>
                    {history.return_time}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default CustomerHistory;
