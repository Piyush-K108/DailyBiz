import { API_URL } from "../../../config";
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
  Card,
  CardContent,
  IconButton,
  Box,
  TextField,
  Tooltip,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { Search, CalendarToday, CloudDownload } from "@mui/icons-material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import {
  BatteryChargingFull,
  BatteryUnknown,
  BatteryFull,
  SwapHoriz,
  BatteryAlert,
} from "@mui/icons-material"; // MUI Icons
import * as XLSX from "xlsx";
import MyDatePicker from "../../../components/DatePicker";
import { useNavigate } from "react-router-dom";
import StatBox from "../../../components/StatBox";
const BatteryDashboard = () => {
  const navigate = useNavigate();
  const [TodaysSwaps, setTodaysSwaps] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredRow, setHoveredRow] = useState(null);
  const [page3, setPage3] = useState(0);
  const [rowsPerPage3, setRowsPerPage3] = useState(10);
  const [DataLoading, setDataLoading] = useState(false);
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
  const day = String(today.getDate()).padStart(2, "0");

  const formattedToday = `${year}-${month}-${day}`;

  const [selectedDate, setSelectedDate] = useState(formattedToday);

  const filteredSwaps = TodaysSwaps.filter((swap) => {
    const userName = swap.swapped_by?.user_name?.toLowerCase() || "";
    const userPhone = swap.swapped_by?.user_phone?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();

    return userName.includes(query) || userPhone.includes(query);
  });

  const handleEdit = (swapId) => {
    navigate(`/editSwap/${swapId}`);
  };
  const handleDelete = async (swapId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this swap?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8000/Delivery-Admin/delete_swaps/${swapId}/`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Swap deleted successfully");
        window.location.reload(); // Reload data after deletion
      } else {
        alert("Failed to delete swap");
      }
    } catch (error) {
      console.error("Error deleting swap:", error);
      alert("Error deleting swap");
    }
  };

  const DownloadTodaysSwaps = () => {
    const dataForExcel = filteredSwaps.map((swap) => {
      const utcDate = swap.swap_details?.swapped_at
        ? new Date(swap.swap_details.swapped_at)
        : null;

      let swappedDate = "N/A";
      let swappedTime = "N/A";

      if (utcDate) {
        const istOffset = 5.5 * 60 * 60 * 1000; // IST Offset
        const istDate = new Date(utcDate.getTime() - istOffset);

        swappedDate = istDate.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });

        swappedTime = istDate.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      }

      return {
        "Swapped By (User Name)": swap.swapped_by?.user_name || "Unknown",
        "Swapped By (User Phone)": swap.swapped_by?.user_phone || "N/A",
        "Customer Name": swap.rental_details?.customer_name || "N/A",
        "Bike ID": swap.rental_details?.bike_id || "N/A",
        "Original Battery": swap.rental_details?.previous_battery || "N/A",
        "New Battery": swap.rental_details?.current_battery || "N/A",
        "Swapped Date": swappedDate,
        "Swapped Time": swappedTime,
      };
    });

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(dataForExcel);

    // Dynamically set column widths based on the longest entry in each column
    const colWidths = Object.keys(dataForExcel[0]).map((key) => ({
      wch:
        Math.max(
          key.length, // Column title length
          ...dataForExcel.map((row) =>
            row[key] ? row[key].toString().length : 10
          )
        ) + 2, // Adding some padding
    }));

    ws["!cols"] = colWidths;

    // Create and download workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Today's Swaps");
    XLSX.writeFile(wb, `todays_swaps_${searchQuery}_${selectedDate}.xlsx`);
  };

  const [unassignedBatteries, setUnassignedBatteries] = useState([]);
  const [assignedBatteries, setAssignedBatteries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page2, setPage2] = useState(0);
  const [rowsPerPage2, setRowsPerPage2] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        const [unassignedRes, assignedRes, swapRes] = await Promise.all([
          fetch(`http://${API_URL}/Delivery/batteries-unassigned/`),
          fetch(`http://${API_URL}/Delivery/batteries-assigned/`),
          fetch(
            `http://${API_URL}/Team/delivery-Todays-Swap/${selectedDate}/`
          ),
        ]);
        const unassignedData = await unassignedRes.json();
        const assignedData = await assignedRes.json();
        const swapData = await swapRes.json();

        setUnassignedBatteries(
          Array.isArray(unassignedData)
            ? unassignedData
            : unassignedData.results || []
        );
        setAssignedBatteries(
          Array.isArray(assignedData)
            ? assignedData
            : assignedData.results || []
        );
        setTodaysSwaps(swapData);
      } catch (error) {
        console.error("Error fetching battery data:", error);
      } finally {
        setLoading(false);
        setDataLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  const handleChangePage3 = (event, newPage) => {
    setPage3(newPage);
  };

  const handleChangeRowsPerPage3 = (event) => {
    setRowsPerPage3(parseInt(event.target.value, 10));
    setPage3(0);
  };
  const handleDateChange = (date) => {
    true;
    setSelectedDate(date);
  };

  return (
    <div className="bg-white flex flex-col h-screen p-6 overflow-auto">
      <Typography variant="h4" className="font-semibold mb-10">
        Battery Management
      </Typography>

      <div className="grid grid-cols-2 gap-5 ml-3 mr-6 sm:ml-10 items-center sm:grid-cols-4 m-10">
        <StatBox
          title="Total Assigned Batteries"
          value={assignedBatteries.length}
          icon2={<BatteryChargingFull fontSize="large" color="primary" />} // MUI Icon
        />
        <StatBox
          title="Total Unassigned Batteries"
          value={unassignedBatteries.length}
          icon2={<BatteryUnknown fontSize="large" color="error" />} // MUI Icon
        />
        <StatBox
          title="Total Batteries"
          value={assignedBatteries.length + unassignedBatteries.length}
          icon2={<BatteryFull fontSize="large" color="success" />} // MUI Icon
        />
        <StatBox
          title="Total Swaps Today"
          value={0} // You need to define `swapsToday`
          icon2={<SwapHoriz fontSize="large" color="secondary" />} // MUI Icon
        />
      </div>
      {/* Assigned Batteries Table */}
      <div className="flex-1  ">
        {DataLoading && !TodaysSwaps ? ( // Display Loading animation when Loading is true
          <div className=" p-2 mt-8 ml-8 mr-8 mb-8 rounded-lg shadow-lg ">
            <div className="flex justify-center items-center flex-row gap-3">
              <div className="w-4 h-4 rounded-full  bg-yellow-400 animate-bounce"></div>
              <div className="w-4 h-4 rounded-full bg-yellow-400 animate-bounce [animation-delay:-.3s]"></div>
              <div className="w-4 h-4 rounded-full bg-yellow-400 animate-bounce [animation-delay:-.3s]"></div>
              <div className="w-4 h-4 rounded-full bg-yellow-400 animate-bounce [animation-delay:-.3s]"></div>
              <div className="w-4 h-4 rounded-full bg-yellow-400 animate-bounce [animation-delay:-.5s]"></div>
            </div>
          </div>
        ) : TodaysSwaps && TodaysSwaps.length > 0 ? (
          <>
            <div className=" p-4 flex flex-col sm:flex-row justify-between items-center">
              <div className="flex flex-row space-x-4 items-center">
                <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <SwapHoriz className="text-yellow-500" />
                  Today's Swaps <span className="text-yellow-500">{TodaysSwaps.length}</span>
                </h1>
                <MyDatePicker onDateChange={handleDateChange} />
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto mt-3 sm:mt-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                  <TextField
                    placeholder="Search user or phone..."
                    variant="outlined"
                    size="small"
                    className="pl-10 bg-gray-100 rounded-md"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <button
                  onClick={DownloadTodaysSwaps}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-4 py-2 rounded-md flex items-center gap-2 transition"
                >
                  <CloudDownload />
                  <span>Download</span>
                </button>
              </div>
            </div>
            <div className="bg-white flex flex-col  mb-4">
              <Card
                className="shadow-lg"
                style={{ borderRadius: "12px", border: "1px solid #ddd" }}
              >
                <CardContent style={{ maxHeight: "60vh", overflowY: "auto" }}>
                  <TableContainer
                    component={Paper}
                    style={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}
                  >
                    <div style={{ width: "100%", overflow: "hidden" }}>
                      {" "}
                      {/* Prevents whole screen shift */}
                      <div style={{ overflowX: "auto", maxWidth: "100%" }}>
                        {" "}
                        {/* Table Scrolls Horizontally */}
                        <Table style={{ minWidth: "1200px" }}>
                          {" "}
                          {/* Ensures proper layout */}
                          <TableHead style={{ backgroundColor: "#F7D117" }}>
                            <TableRow>
                              {/* <TableCell>
                                          <b>Swap ID</b>
                                        </TableCell> */}
                              <TableCell>
                                <b>Swapped By (User Name)</b>
                              </TableCell>
                              <TableCell>
                                <b>Swapped By (User Phone)</b>
                              </TableCell>
                              <TableCell>
                                <b>Customer Name</b>
                              </TableCell>
                              <TableCell>
                                <b>Customer Phone</b>
                              </TableCell>
                              {/* <TableCell>
                                          <b>Rental ID</b>
                                        </TableCell> */}
                              <TableCell>
                                <b>Bike ID</b>
                              </TableCell>
                              <TableCell>
                                <b>Original Battery</b>
                              </TableCell>
                              <TableCell>
                                <b>New Battery</b>
                              </TableCell>
                              <TableCell>
                                <b>Swapped Date</b>
                              </TableCell>
                              <TableCell>
                                <b>Swapped Time</b>
                              </TableCell>
                              {/* <TableCell>
                                          <b>Amount</b>
                                        </TableCell> */}
                              {/* <TableCell>
                                          <b>Location (Taken → Dropped)</b>
                                        </TableCell>
                                        <TableCell>
                                          <b>Completed</b>
                                        </TableCell> */}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {filteredSwaps
                              .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                              )
                              .map((swap) => (
                                <TableRow key={swap.id}>
                                  {/* <TableCell style={{ whiteSpace: "nowrap" }}>
                                            {swap.id}
                                          </TableCell> */}
                                  <TableCell style={{ whiteSpace: "nowrap" }}>
                                    {swap.swapped_by?.user_name || "Unknown"}
                                  </TableCell>
                                  <TableCell style={{ whiteSpace: "nowrap" }}>
                                    {swap.swapped_by?.user_phone || "N/A"}
                                  </TableCell>
                                  <TableCell style={{ whiteSpace: "nowrap" }}>
                                    {swap.rental_details?.customer_name ||
                                      "N/A"}
                                  </TableCell>
                                  <TableCell style={{ whiteSpace: "nowrap" }}>
                                    {swap.rental_details?.customer_phone ||
                                      "N/A"}
                                  </TableCell>
                                  {/* <TableCell style={{ whiteSpace: "nowrap" }}>
                                            {swap.rental_details?.rental_id || "N/A"}
                                          </TableCell> */}
                                  <TableCell style={{ whiteSpace: "nowrap" }}>
                                    {swap.rental_details?.bike_id || "N/A"}
                                  </TableCell>
                                  <TableCell style={{ whiteSpace: "nowrap" }}>
                                    {swap.rental_details?.previous_battery ||
                                      "N/A"}
                                  </TableCell>
                                  <TableCell style={{ whiteSpace: "nowrap" }}>
                                    {swap.rental_details?.current_battery ||
                                      "N/A"}
                                  </TableCell>
                                  <TableCell style={{ whiteSpace: "nowrap" }}>
                                    {swap.swap_details?.swapped_at
                                      ? (() => {
                                          const utcDate = new Date(
                                            swap.swap_details.swapped_at
                                          );
                                          const istOffset =
                                            5.5 * 60 * 60 * 1000;
                                          const istDate = new Date(
                                            utcDate.getTime() - istOffset
                                          ); // Convert to IST
                                          return istDate.toLocaleDateString(
                                            "en-IN",
                                            {
                                              day: "2-digit",
                                              month: "2-digit",
                                              year: "numeric",
                                            }
                                          ); // Proper DD-MM-YYYY format
                                        })()
                                      : "N/A"}
                                  </TableCell>

                                  <TableCell style={{ whiteSpace: "nowrap" }}>
                                    {swap.swap_details?.swapped_at
                                      ? (() => {
                                          const utcDate = new Date(
                                            swap.swap_details.swapped_at
                                          );
                                          const istOffset =
                                            5.5 * 60 * 60 * 1000;
                                          const istDate = new Date(
                                            utcDate.getTime() - istOffset
                                          ); // Convert to IST
                                          return istDate.toLocaleTimeString(
                                            "en-IN",
                                            {
                                              hour: "2-digit",
                                              minute: "2-digit",

                                              hour12: true,
                                            }
                                          ); // Proper HH:MM AM/PM format
                                        })()
                                      : "N/A"}
                                  </TableCell>

                                  {/* <TableCell style={{ whiteSpace: "nowrap" }}>
                                            {swap.swap_details?.Amount || "0"}
                                          </TableCell>
                                          <TableCell style={{ whiteSpace: "nowrap" }}>
                                            {swap.swap_details?.taken_location ||
                                              "N/A"}{" "}
                                            →{" "}
                                            {swap.swap_details?.drop_location ||
                                              "N/A"}
                                          </TableCell>
                                          <TableCell style={{ whiteSpace: "nowrap" }}>
                                            {swap.swap_details?.complete
                                              ? "✅"
                                              : "❌"}
                                          </TableCell> */}
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </TableContainer>
                </CardContent>

                <TablePagination
                  rowsPerPageOptions={[10, 25, 50]}
                  component="div"
                  count={TodaysSwaps.length}
                  rowsPerPage={rowsPerPage3}
                  page={page3}
                  onPageChange={handleChangePage3}
                  onRowsPerPageChange={handleChangeRowsPerPage3}
                />
              </Card>
            </div>
          </>
        ) : (
          <Typography className="text-center" variant="h6">
            No Swaps Today Available.
          </Typography>
        )}
      </div>
      <div className="bg-white flex flex-col w-full">
        <Typography variant="h5" className="text-black font-semibold mb-4">
          Assigned Batteries
        </Typography>
        <Card
          className="shadow-lg"
          style={{ borderRadius: "12px", border: "1px solid #ddd" }}
        >
          <CardContent style={{ maxHeight: "50vh", overflowY: "auto" }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead style={{ backgroundColor: "#F7D117" }}>
                  <TableRow>
                    {[
                      "Battery",
                      "Swap Date",
                      "Customer Name",
                      "Phone",
                      "Bike License",
                      "Bike Type",
                      "Rental Date",
                      "Duration",
                    ].map((head) => (
                      <TableCell
                        key={head}
                        style={{ color: "black", fontWeight: "bold" }}
                      >
                        {head}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assignedBatteries
                    .sort(
                      (a, b) => new Date(b.swapped_at) - new Date(a.swapped_at)
                    )
                    .slice(
                      page2 * rowsPerPage2,
                      page2 * rowsPerPage2 + rowsPerPage2
                    )
                    .map((swap, index) => (
                      <TableRow
                        key={index}
                        style={{
                          backgroundColor:
                            index % 2 === 0 ? "#F9F9F9" : "white",
                        }}
                      >
                        <TableCell>{swap.battery}</TableCell>
                        <TableCell>
                          {new Date(swap.swapped_at).toLocaleString("en-GB")}
                        </TableCell>
                        <TableCell>
                          {swap.rental?.user?.user?.name || "N/A"}
                        </TableCell>
                        <TableCell>
                          {swap.rental?.user?.user?.phone || "N/A"}
                        </TableCell>
                        <TableCell>
                          {swap.rental?.bike?.license_plate || "N/A"}
                        </TableCell>
                        <TableCell>
                          {swap.rental?.bike?.type || "N/A"}
                        </TableCell>
                        <TableCell>
                          {swap.rental?.rental_date
                            ? new Date(
                                swap.rental.rental_date
                              ).toLocaleDateString("en-GB")
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {swap.rental?.duration
                            ? `${swap.rental.duration} ${swap.rental.mode_of_rental}`
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
          <TablePagination
            className="mr-10"
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={assignedBatteries.length}
            rowsPerPage={rowsPerPage2}
            page={page2}
            onPageChange={(event, newPage) => setPage2(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage2(parseInt(event.target.value, 10)); // Use 10 as the base
              setPage2(0); // Reset to first page when changing rows per page
            }}
          />
        </Card>
      </div>

      <div className="flex flex-col w-full mt-10">
        {/* Unassigned Batteries Table */}
        <Typography variant="h5" className="text-black font-semibold mt-6 mb-4">
          Unassigned Batteries
        </Typography>
        <Card
          className="shadow-lg"
          style={{ borderRadius: "12px", border: "1px solid #ddd" }}
        >
          <CardContent>
            <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead style={{ backgroundColor: "#F7D117" }}>
                    <TableRow>
                      <TableCell style={{ color: "black", fontWeight: "bold" }}>
                        ID
                      </TableCell>
                      <TableCell style={{ color: "black", fontWeight: "bold" }}>
                        Charging
                      </TableCell>
                      <TableCell style={{ color: "black", fontWeight: "bold" }}>
                        Charge %
                      </TableCell>
                      <TableCell style={{ color: "black", fontWeight: "bold" }}>
                        Capacity
                      </TableCell>
                      <TableCell style={{ color: "black", fontWeight: "bold" }}>
                        Status
                      </TableCell>
                      <TableCell style={{ color: "black", fontWeight: "bold" }}>
                        Condition
                      </TableCell>
                      <TableCell style={{ color: "black", fontWeight: "bold" }}>
                        Temperature (°C)
                      </TableCell>
                      <TableCell style={{ color: "black", fontWeight: "bold" }}>
                        Voltage (V)
                      </TableCell>
                      <TableCell style={{ color: "black", fontWeight: "bold" }}>
                        Health
                      </TableCell>
                      <TableCell style={{ color: "black", fontWeight: "bold" }}>
                        Type
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {unassignedBatteries
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((battery) => (
                        <TableRow key={battery.battery_id} hover>
                          <TableCell>{battery.battery_id}</TableCell>
                          <TableCell>
                            {battery.charging_status ? (
                              <BatteryChargingFull color="success" />
                            ) : (
                              <BatteryAlert color="error" />
                            )}
                          </TableCell>
                          <TableCell>
                            <Tooltip title={`${battery.charging_percentage}%`}>
                              <CircularProgress
                                variant="determinate"
                                value={battery.charging_percentage}
                                size={30}
                                thickness={5}
                                color={
                                  battery.charging_percentage > 20
                                    ? "success"
                                    : "error"
                                }
                              />
                            </Tooltip>
                          </TableCell>
                          <TableCell>{battery.capacity} Wh</TableCell>
                          <TableCell>
                            {battery.is_assigned ? (
                              <Typography style={{ color: "green" }}>
                                Assigned
                              </Typography>
                            ) : (
                              <Typography style={{ color: "orange" }}>
                                Unassigned
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {battery.condition ? "Good" : "Bad"}
                          </TableCell>
                          <TableCell>{battery.temperature}°C</TableCell>
                          <TableCell>{battery.voltage}V</TableCell>
                          <TableCell>{battery.health}%</TableCell>
                          <TableCell>{battery.battery_type}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            {/* Keep pagination outside the scrollable div */}
            <TablePagination
              className="mr-5"
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={unassignedBatteries.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BatteryDashboard;
