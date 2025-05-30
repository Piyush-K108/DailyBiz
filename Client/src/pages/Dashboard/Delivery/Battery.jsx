import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  CircularProgress,
  Box
} from "@mui/material";
import { API_URL } from "../../../config";

const Battery = () => {
  const location = useLocation();
  const { battery_id } = location.state;
  const [batteryData, setBatteryData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBatteryData = async () => {
      try {
        const response = await fetch(
          `http://${API_URL}/Delivery/batteries/${battery_id}/`
        );
        const data = await response.json();

        if (Array.isArray(data)) {
          setBatteryData(data);
        } else if (data && data.results) {
          setBatteryData(data.results);
        } else {
          console.error("Unexpected API response format:", data);
          setBatteryData([]);
        }
      } catch (error) {
        console.error("Error fetching battery data:", error);
        setBatteryData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBatteryData();
  }, [battery_id]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (!batteryData.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Typography variant="h6" color="textSecondary">
          No battery swap data found.
        </Typography>
      </div>
    );
  }

  return (
    <div className="bg-white flex flex-col w-full h-screen p-6">
      <Typography variant="h4" className="text-black font-semibold mb-4">
        <span style={{ color: '' }}>Battery Swap</span> Details
      </Typography>
      <Card className="shadow-lg" style={{ borderRadius: "12px", border: "1px solid #ddd" }}>
        <CardContent>
          <TableContainer component={Paper} style={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
            <Table>
              <TableHead style={{ backgroundColor: "#F7D117" }}>
                <TableRow>
                  <TableCell style={{ color: "black", fontWeight: "bold" }}>Swap Date</TableCell>
                  <TableCell style={{ color: "black", fontWeight: "bold" }}>Customer Name</TableCell>
                  <TableCell style={{ color: "black", fontWeight: "bold" }}>Phone</TableCell>
                  <TableCell style={{ color: "black", fontWeight: "bold" }}>Bike License</TableCell>
                  <TableCell style={{ color: "black", fontWeight: "bold" }}>Bike Type</TableCell>
                  <TableCell style={{ color: "black", fontWeight: "bold" }}>Rental Date</TableCell>
                  <TableCell style={{ color: "black", fontWeight: "bold" }}>Duration</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {batteryData
                  .sort((a, b) => new Date(b.swapped_at) - new Date(a.swapped_at))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((swap, index) => (
                    <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? '#F9F9F9' : 'white' }}>
                      <TableCell>{new Date(swap.swapped_at).toLocaleString("en-GB")}</TableCell>
                      <TableCell>{swap.rental.user.user.name}</TableCell>
                      <TableCell>{swap.rental.user.user.phone}</TableCell>
                      <TableCell>{swap.rental.bike.license_plate}</TableCell>
                      <TableCell>{swap.rental.bike.type}</TableCell>
                      <TableCell>{new Date(swap.rental.rental_date).toLocaleDateString("en-GB")}</TableCell>
                      <TableCell>
                        {swap.rental.duration} {swap.rental.mode_of_rental}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={batteryData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Battery;
