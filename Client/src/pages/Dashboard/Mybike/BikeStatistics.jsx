import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  IconButton,
  PaginationItem
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReceiptIcon from "@mui/icons-material/Receipt"; // Icon for bill link
import { API_URL } from "../../../config";
const BikeStatistics = () => {
  const [statistics, setStatistics] = useState(null);
  const [history, setHistory] = useState([]);
  const [servicingHistory, setServicingHistory] = useState([]);
  const location = useLocation();
  const { bikeId,hasRevenueAccess } = location.state;
  const [page, setPage] = useState(1);
  const [servicePage, setServicePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [serviceTotalPages, setServiceTotalPages] = useState(1);


  useEffect(() => {
    fetch(`http://${API_URL}/Admin/bike-statistics/${bikeId}/`)
      .then((res) => res.json())
      .then((data) => setStatistics(data));
  }, [bikeId]);

  useEffect(() => {
    fetch(`http://${API_URL}/Admin/bike-history/${bikeId}/?page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        setHistory(data.results);
        setTotalPages(Math.ceil(data.count / 10));
      });
  }, [bikeId, page]);

  useEffect(() => {
    fetch(
      `http://${API_URL}/Admin/bike-servicing-history/${bikeId}/?page=${servicePage}`
    )
      .then((res) => res.json())
      .then((data) => {
        setServicingHistory(data.results);
        setServiceTotalPages(Math.ceil(data.count / 10));
      });
  }, [bikeId, servicePage]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 4,
      }}
    >
      {statistics && hasRevenueAccess && (
        <Card
          sx={{
            width: "80%",
            p: 3,
            bgcolor: "#f9fafb",
            boxShadow: 5,
            borderRadius: 2,
            mb: 4,
          }}
        >
          <CardContent>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ color: "#374151", fontWeight: "bold", textAlign: "center" }}
            >
              Bike Statistics
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "#eab308",
                fontWeight: "bold",
                mb: 2,
                textAlign: "center",
              }}
            >
              {statistics.bike_id}
            </Typography>
            <Grid
              container
              spacing={2}
              sx={{ border: "1px solid #ddd", borderRadius: 2, p: 2 }}
            >
              {Object.entries(statistics).map(
                ([key, value]) =>
                  key !== "bike_id" && (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      key={key}
                      sx={{
                        border: "1px solid #ddd",
                        p: 1,
                        textAlign: "center",
                      }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        {key.replace(/_/g, " ")}:
                      </Typography>
                      <Typography sx={{ color: "#eab308", fontWeight: "bold" }}>
                        {value}
                      </Typography>
                    </Grid>
                  )
              )}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Rentals Table */}
      <TableContainer
        component={Paper}
        sx={{ width: "80%", boxShadow: 3, borderRadius: 2, mb: 5 }}
      >
        <Table>
          <TableHead sx={{ bgcolor: "#eab308" }}>
            <TableRow>
              {[
                "Type",
                "Customer Name",
                "Phone",
                "Rental Date",
                "Return Date",
                "Rental Time",
                "Return Time",
                "KM Went",
                "Personal Use",
                "Total Amount",
                "Payment Mode",
              ].map((header) => (
                <TableCell
                  key={header}
                  sx={{
                    color: "black",
                    fontWeight: "bold",
                    textAlign: "center",
                    border: "1px solid #ddd",
                    whiteSpace: "nowrap",
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((entry, index) => (
              <TableRow
                key={index}
                sx={{ bgcolor: index % 2 === 0 ? "#f3f4f6" : "white" }}
              >
                {[
                  entry.type,
                  entry.name,
                  entry.phone,
                  entry.rental_date,
                  entry.return_date,
                  entry.rental_time,
                  entry.return_time,
                  entry.KM_Went,
                  entry.Personal_use ? "Yes" : "No",
                  entry.TotalAmount,
                  entry.PaymentMode,
                ].map((value, i) => (
                  <TableCell
                    key={i}
                    align="center"
                    sx={{ border: "1px solid #ddd" }}
                  >
                    {value}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ m: 3, display: "flex", justifyContent: "center" }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(event, value) => setPage(value)}
          size="large"
          sx={{
            bgcolor: "#f9fafb", // Background color
            p: 1,
            borderRadius: 2,
            boxShadow: 2,
          }}
          renderItem={(item) => (
            <PaginationItem
              {...item}
              sx={{
                color: "#eab308", // Text color for all items
                border: "1px solid #eab308", // Border for all items
                "&:hover": {
                  bgcolor: "#fef3c7", // Light yellow hover effect
                },
                "&.Mui-selected": {
                  bgcolor: "#eab308", // Active button background
                  color: "white", // Active button text color
                  fontWeight: "bold",
                },
              }}
            />
          )}
        />
      </Box>

      {/* Servicing Table */}
      <TableContainer
        component={Paper}
        sx={{ width: "80%", boxShadow: 3, borderRadius: 2, mb: 10 }}
      >
        <Table>
          <TableHead sx={{ bgcolor: "#eab308" }}>
            <TableRow>
              {["Type", "Service Date", "KM", "Paid", "Mode", "Bill"].map(
                (header) => (
                  <TableCell
                    key={header}
                    sx={{
                      color: "black",
                      fontWeight: "bold",
                      textAlign: "center",
                      border: "1px solid #ddd",
                    }}
                  >
                    {header}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {servicingHistory.map((service, index) => (
              <TableRow
                key={index}
                sx={{ bgcolor: index % 2 === 0 ? "#f3f4f6" : "white" }}
              >
                <TableCell align="center" sx={{ border: "1px solid #ddd" }}>
                  {service.type}
                </TableCell>
                <TableCell align="center" sx={{ border: "1px solid #ddd" }}>
                  {service.service_date}
                </TableCell>
                <TableCell align="center" sx={{ border: "1px solid #ddd" }}>
                  {service.KM}
                </TableCell>
                <TableCell align="center" sx={{ border: "1px solid #ddd" }}>
                  {service.Payed}
                </TableCell>
                <TableCell align="center" sx={{ border: "1px solid #ddd" }}>
                  {service.Mode}
                </TableCell>
                <TableCell align="center" sx={{ border: "1px solid #ddd" }}>
                  {service.Bill_URL ? (
                    <IconButton
                      href={service.Bill_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ReceiptIcon sx={{ color: "#eab308" }} />
                    </IconButton>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Pagination for Servicing */}
      <Box sx={{ m: 3, display: "flex", justifyContent: "center" }}>
        <Pagination
          count={serviceTotalPages}
          page={servicePage}
          onChange={(event, value) => setServicePage(value)}
          color="primary"
          size="large"
          sx={{ bgcolor: "#f9fafb", p: 1, borderRadius: 2, boxShadow: 2 }}
        />
      </Box>
    </Box>
  );
};

export default BikeStatistics;
