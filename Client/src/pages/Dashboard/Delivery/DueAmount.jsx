import React, { useEffect, useState } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
  Collapse,
  TablePagination,
  Box,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { API_URL } from "../../../config";
const DueAmount = () => {
  const [rentalData, setRentalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [expandedRows, setExpandedRows] = useState({});
  const [filter, setFilter] = useState("due"); // "due" or "cleared"

  useEffect(() => {
    fetch(`http://${API_URL}/Delivery/due-amount/`)
      .then((response) => response.json())
      .then((result) => {
        if (result.rentals) {
          setRentalData(result.rentals);
          applySorting(result.rentals, "due"); // Default filter is "due"
        }
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const applySorting = (data, filterType) => {
    let sortedData = [...data];
  
    if (filterType === "due") {
      sortedData = sortedData
        .filter((rental) => rental.due_amount > 0)
        .sort((a, b) => {
          const dateA = a.due_date_gone ? parseDate(a.due_date_gone) : new Date(0);
          const dateB = b.due_date_gone ? parseDate(b.due_date_gone) : new Date(0);
          return dateA - dateB; // Oldest first
        });
    } else {
      sortedData = sortedData
        .filter((rental) => rental.due_amount <= 0)
        .sort((a, b) => {
          const dateA = b.due_date_cleared ? parseDate(b.due_date_cleared) : new Date(0);
          const dateB = a.due_date_cleared ? parseDate(a.due_date_cleared) : new Date(0);
          return dateA - dateB; // Most recent first
        });
    }
  
    setFilteredData(sortedData);
  };
  
  // Helper function to parse 'DD-MM-YYYY' formatted dates
  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  };
  

  const handleExpandClick = (rentalId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rentalId]: !prev[rentalId],
    }));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter);
      setPage(0); // Reset pagination on filter change
      applySorting(rentalData, newFilter);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress sx={{ color: "#FACC15" }} />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" align="start" gutterBottom sx={{ fontWeight: "bold", color: "black" }}>
        Rental Payments Overview
      </Typography>

      {/* Toggle Filter Button */}
      <Box display="flex" justifyContent="center" mb={2}>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={handleFilterChange}
          aria-label="filter"
          sx={{
            backgroundColor: "#FACC15",
            "& .Mui-selected": { backgroundColor: "black", color: "#FACC15" },
          }}
        >
          <ToggleButton value="due" sx={{ fontWeight: "bold", color: "black" }}>
            Due Amounts
          </ToggleButton>
          <ToggleButton value="cleared" sx={{ fontWeight: "bold", color: "black" }}>
            Cleared Amounts
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Table with Pagination */}
      <TableContainer component={Paper} sx={{ mt: 2, borderRadius: "12px", overflow: "hidden" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#FACC15" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", color: "black" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "black" }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "black" }}>License Plate</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "black" }}>Due Amount</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "black" }}>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((rental) => (
              <React.Fragment key={rental.rental_id}>
                <TableRow>
                  <TableCell>{rental.name}</TableCell>
                  <TableCell>{rental.phone}</TableCell>
                  <TableCell>{rental.license_plate}</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: rental.due_amount > 0 ? "red" : "green" }}>
                  ₹{Math.abs(rental.due_amount)}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => handleExpandClick(rental.rental_id)}
                      endIcon={expandedRows[rental.rental_id] ? <ExpandLess /> : <ExpandMore />}
                      sx={{
                        backgroundColor: "#FACC15",
                        color: "black",
                        "&:hover": {
                          backgroundColor: "black",
                          color: "#FACC15",
                        },
                      }}
                    >
                      More
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={5} style={{ paddingBottom: 0, paddingTop: 0 }}>
                    <Collapse in={expandedRows[rental.rental_id]} timeout="auto" unmountOnExit>
                      <Box margin={1}>
                        <Typography variant="body2">
                          {rental.due_date_gone
                            ? `Overdue Since: ${rental.due_date_gone}`
                            : `Cleared By: ${rental.due_date_cleared}`}
                        </Typography>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          color: "black",
          borderRadius: "8px",
          mt: 2,
        }}
      />
    </Box>
  );
};

export default DueAmount;





{/* <CardContent>
<Box display="flex" alignItems="center" gap={1}>
  <AccountCircle
    sx={{
      color: "#000",
      transition: "color 0.3s ease-in-out",
      ".MuiCard-root:hover &": { color: "#facc15" },
    }}
  />
  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
    {rental.name}
  </Typography>
</Box>

<Box display="flex" alignItems="center" gap={1}>
  <Phone
    sx={{
      color: "#000",
      transition: "color 0.3s ease-in-out",
      ".MuiCard-root:hover &": { color: "#facc15" },
    }}
  />
  <Typography>{rental.phone}</Typography>
</Box>

<Box display="flex" alignItems="center" gap={1}>
  <DirectionsBike
    sx={{
      color: "#000",
      transition: "color 0.3s ease-in-out",
      ".MuiCard-root:hover &": { color: "#facc15" },
    }}
  />
  <Typography>Bike: {rental.license_plate}</Typography>
</Box>

<Typography
  variant="h6"
  sx={{
    fontWeight: "bold",
    color: rental.due_amount > 0 ? "red" : "green",
  }}
>
  Due: ${rental.due_amount}
</Typography>
<Typography>
  {rental.due_date_gone
    ? `Overdue Since: ${rental.due_date_gone}`
    : `Cleared By: ${rental.due_date_cleared}`}
</Typography>
</CardContent> */}