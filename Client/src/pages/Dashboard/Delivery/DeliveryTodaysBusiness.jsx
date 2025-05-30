import React, { useState, useEffect } from "react";
import BikeInfoCard from "../../../components/bike-info-component/BikeinfoCard";
import StatBox from "../../../components/bike-info-component/StatsOfbikes";
import MopedIcon from "@mui/icons-material/Moped";
import ElectricMopedIcon from "@mui/icons-material/ElectricMoped";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import { API_URL } from "../../../config";
import LoadingAnimation from "../../../components/LoadingAnimation";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { Edit, Delete } from "@mui/icons-material";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Button,
  Collapse,
  TablePagination,
  Card,
  CardContent,
  Box,
  TextField,
} from "@mui/material";

import * as XLSX from "xlsx";
import MyDatePicker from "../../../components/DatePicker";
import { useNavigate } from "react-router-dom";

function DeliveryTodaysBusiness() {
  const [rentals, setRentals] = useState([]);
  const [Real, setReal] = useState([]);


  const [Realcash_upi, setRealcash_upi] = useState([]);
  const navigate = useNavigate();

  const [selectedSwapId, setSelectedSwapId] = useState(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [payments, setPayments] = useState({});
  const [Swaps, setSwaps] = useState({});
  const [deposits, setDeposits] = useState({});




  const [page2, setPage2] = useState(0);
  const [rowsPerPage2, setRowsPerPage2] = useState(10);

  const [Loading, setLoading] = useState(true);
  const [DataLoading, setDataLoading] = useState(false);
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
  const day = String(today.getDate()).padStart(2, "0");

  const formattedToday = `${year}-${month}-${day}`;

  const [selectedDate, setSelectedDate] = useState(formattedToday);
 

  useEffect(() => {
    fetchTodayData();
    fetchDetails();
    fetchReal();
  }, [selectedDate]);

  const fetchReal = async () => {
    try {
      const response = await fetch(
        `http://${API_URL}/Delivery-Admin/topstates/${selectedDate}/`
      );
      const data = await response.json();

      setReal(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const fetchDetails = async () => {
    try {
      const response = await fetch(
        `http://${API_URL}/Delivery-Admin/todaysrevue/${selectedDate}/`
      );
      const data = await response.json();

      setRealcash_upi(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchTodayData = () => {
    setDataLoading(true);

    const rentalFetch = fetch(
      `http://${API_URL}/Delivery-Admin/TodaysRentalDelivery/${selectedDate}/`
    ).then((response) => response.json());

   
    Promise.all([rentalFetch])
      .then(([rentalData]) => {
        setRentals(rentalData);
        setDataLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setDataLoading(false);
      });
  };

  const fetchPaymentDetails = (rentalId) => {
    if (payments[rentalId]) return; // Don't fetch again if already exists

    fetch(`http://${API_URL}/Delivery-Admin/RentalFinancialAPI/${rentalId}/`)
      .then((response) => response.json())
      .then((data) => {
        setPayments((prev) => ({ ...prev, [rentalId]: data.payments }));
        setDeposits((prev) => ({ ...prev, [rentalId]: data.deposits }));
      })
      .catch((error) =>
        console.error("Error fetching payment details:", error)
      );
  };

  const fetchSwapDetails = (rentalId) => {
    if (Swaps[rentalId]) return; // Don't fetch again if already exists
    true;
    fetch(
      `http://${API_URL}/Delivery-Admin/ActiveBatterySwapsAPI/${rentalId}/`
    )
      .then((response) => response.json())
      .then((data) => {
        setSwaps((prev) => ({ ...prev, [rentalId]: data.battery_swaps }));
        false;
      })
      .catch((error) => {
        false;
        console.error("Error fetching swap details:", error);
      });
  };

  const handleSwapToggle = (rentalId) => {
    if (selectedSwapId === rentalId) {
      setSelectedSwapId(null);
    } else {
      setSelectedSwapId(rentalId);
      fetchSwapDetails(rentalId);
    }
  };

  const handlePaymentToggle = (rentalId) => {
    if (selectedPaymentId === rentalId) {
      setSelectedPaymentId(null);
    } else {
      setSelectedPaymentId(rentalId);
      fetchPaymentDetails(rentalId);
    }
  };


  const handleChangePage2 = (event, newPage) => {
    setPage2(newPage);
  };

  const handleChangeRowsPerPage2 = (event) => {
    setRowsPerPage2(parseInt(event.target.value, 10));
    setPage2(0);
  };

  const handleDownloadExcel = () => {
    const dataForExcel = [[], ...rentals.map((rentals, index) => [])];

    const ws = XLSX.utils.aoa_to_sheet(dataForExcel);
    ws["!cols"] = Array(dataForExcel[0].length).fill({ wch: 18 });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");

    XLSX.writeFile(wb, `todays_business_${selectedDate}.xlsx`);
  };



  const handleDateChange = (date) => {
    true;
    setSelectedDate(date);
  };

  return (
    <div className="bg-white flex flex-col  h-[100%] ">
      {Loading ? ( // Display Loading animation when Loading is true
        <LoadingAnimation title="Loading...." />
      ) : (
        <>
          <div className="flex  sm:flex-row justify-between sm:items-center mr-10 ml-8 mt-5">
            <MyDatePicker onDateChange={handleDateChange} />
            <div
              onClick={handleDownloadExcel}
              className="flex flex-row  items-center cursor-pointer sm:mt-0  hover:text-yellow-400 hover:underline"
            >
              <CloudDownloadIcon className="mr-4 hover:text-yellow-400 " />
              <h1 className="hover:text-yellow-500 hover:underline hidden sm:block">
                Download Excel
              </h1>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5 ml-3 mr-6 sm:ml-10  items-center sm:grid-cols-4  mt-10 ">
            <StatBox
              title="Total Bikes"
              value={Real.total_bikes}
              icon2={<TwoWheelerIcon fontSize="large" />}
            />
            <StatBox
              title="Total Bikes on Rent"
              value={Real.bikes_on_rent}
              icon2={<DirectionsBikeIcon fontSize="large" />}
            />
            <StatBox
              title="New Rental Today"
              value={Real.total_rentals_today}
              icon2={<ElectricMopedIcon fontSize="large" />}
            />
            <StatBox
              title="New Customers Today"
              value={Real.new_customers}
              icon2={<PersonAddAltIcon fontSize="large" />}
            />
          </div>
          <h1 className="mt-4 ml-8 text-black font-bold capitalize">
            Total Real{" "}
          </h1>

          <div className=" p-2 mt-8 ml-8 mr-8 mb-8 rounded-lg shadow-lg ">
            {DataLoading ? (
              <div className="flex justify-center items-center flex-row gap-3">
                <div className="w-4 h-4 rounded-full bg-yellow-400 animate-bounce"></div>
                <div className="w-4 h-4 rounded-full bg-yellow-400 animate-bounce [animation-delay:-.3s]"></div>
                <div className="w-4 h-4 rounded-full bg-yellow-400 animate-bounce [animation-delay:-.3s]"></div>
                <div className="w-4 h-4 rounded-full bg-yellow-400 animate-bounce [animation-delay:-.3s]"></div>
                <div className="w-4 h-4 rounded-full bg-yellow-400 animate-bounce [animation-delay:-.5s]"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4">
                  {/* Bike ID */}

                  <div className="border-r md:border-r-0 ">
                    <BikeInfoCard title="Cash" data={Realcash_upi.cash} />
                  </div>

                  <div className="border-r md:border-r-0 h-350px">
                    <BikeInfoCard
                      title="Online QR"
                      data={`${Realcash_upi.upi}`}
                    />
                  </div>

                  {/* Current KM Reading */}
                  <div className="border-r md:border-r-0 ">
                    <BikeInfoCard
                      title="Online Phone"
                      data={`${Realcash_upi.phone || 0}`}
                    />
                  </div>

                  <div className="border-r md:border-r-0 h-350px">
                    <BikeInfoCard
                      title="Total"
                      data={Realcash_upi.total || 0}
                    />
                  </div>

                  <div className="border-r md:border-r-0 h-350px">
                    <BikeInfoCard
                      title="Advance Cash"
                      data={Realcash_upi.advance_cash || 0}
                    />
                  </div>

                  <div className="border-r md:border-r-0 h-350px">
                    <BikeInfoCard
                      title="Advance UPI"
                      data={Realcash_upi.advance_upi || 0}
                    />
                  </div>

                  <div className="border-r md:border-r-0 h-350px">
                    <BikeInfoCard
                      title="Advance Phone"
                      data={Realcash_upi.advance_phone || 0}
                    />
                  </div>

                  <div className="border-r md:border-r-0 h-350px">
                    <BikeInfoCard
                      title="Advance Total"
                      data={Realcash_upi.total_advance || 0}
                    />
                  </div>
                </div>
                <div className="w-full ">
                  <BikeInfoCard
                    title="Today's Total Amount"
                    data={Realcash_upi.total + Realcash_upi.total_advance}
                  />
                </div>
              </>
            )}
          </div>

          {/* <h1 className="mt-4 ml-8 text-black font-bold capitalize">
            Total Today{" "}
          </h1>

          <div className=" p-2 mt-8 ml-8 mr-8 mb-8   rounded-lg shadow-lg ">
            {DataLoading ? ( // Display Loading animation when Loading is true
              <div className="flex justify-center items-center flex-row gap-3">
                <div className="w-4 h-4 rounded-full  bg-yellow-400 animate-bounce"></div>
                <div className="w-4 h-4 rounded-full bg-yellow-400 animate-bounce [animation-delay:-.3s]"></div>
                <div className="w-4 h-4 rounded-full bg-yellow-400 animate-bounce [animation-delay:-.3s]"></div>
                <div className="w-4 h-4 rounded-full bg-yellow-400 animate-bounce [animation-delay:-.3s]"></div>
                <div className="w-4 h-4 rounded-full bg-yellow-400 animate-bounce [animation-delay:-.5s]"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4">
                   

                  <div className="border-r md:border-r-0 ">
                    <BikeInfoCard
                      title="Cash"
                      data={TodayRevenue.cash_amount}
                    />
                  </div>

                  <div className="border-r md:border-r-0 h-350px">
                    <BikeInfoCard
                      title="Online QR"
                      data={TodayRevenue.qr_amount}
                    />
                  </div>

                 
                  <div className="border-r md:border-r-0 ">
                    <BikeInfoCard
                      title="Online Phone"
                      data={TodayRevenue.number_amount}
                    />
                  </div>

                  <div className="border-r md:border-r-0 ">
                    <BikeInfoCard title="EV" data={TodayRevenue.EVAmount} />
                  </div>

                  <div className="border-r md:border-r-0 ">
                    <BikeInfoCard
                      title="Petrol"
                      data={TodayRevenue.PetrolAmount}
                    />
                  </div>

                  <div className="border-r md:border-r-0 ">
                    <BikeInfoCard
                      title="Attached"
                      data={TodayRevenue.AttachedAmount}
                    />
                  </div>
                  <div className="border-r md:border-r-0 h-350px">
                    <BikeInfoCard
                      title="Non Attached"
                      data={TodayRevenue.NotAttachedAmount}
                    />
                  </div>

                  <div className="border-r md:border-r-0 ">
                    <BikeInfoCard
                      title="All Activa"
                      data={TodayRevenue.All_Activa}
                    />
                  </div>
                </div>
              </>
            )}
          </div> */}
         
          <div className="p-4">
            {DataLoading && !rentals ? ( // Display Loading animation when Loading is true
              <div className=" p-2 mt-8 ml-8 mr-8 mb-8 rounded-lg shadow-lg ">
                <div className="flex justify-center items-center flex-row gap-3">
                  <div className="w-4 h-4 rounded-full  bg-yellow-400 animate-bounce"></div>
                  <div className="w-4 h-4 rounded-full bg-yellow-400 animate-bounce [animation-delay:-.3s]"></div>
                  <div className="w-4 h-4 rounded-full bg-yellow-400 animate-bounce [animation-delay:-.3s]"></div>
                  <div className="w-4 h-4 rounded-full bg-yellow-400 animate-bounce [animation-delay:-.3s]"></div>
                  <div className="w-4 h-4 rounded-full bg-yellow-400 animate-bounce [animation-delay:-.5s]"></div>
                </div>
              </div>
            ) : rentals && rentals.length > 0 ? (
              <>
                <h1 className="mt-4 ml-8 text-[#212121] font-bold capitalize">
                  Today's Rents{" "}
                </h1>
                <div className="bg-white flex flex-col  h-screen p-6">
                  <Card
                    className="shadow-lg"
                    style={{ borderRadius: "12px", border: "1px solid #ddd" }}
                  >
                    <CardContent
                      style={{ maxHeight: "60vh", overflowY: "auto" }}
                    >
                      <TableContainer
                        component={Paper}
                        style={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}
                      >
                        <Table>
                          <TableHead style={{ backgroundColor: "#F7D117" }}>
                            <TableRow>
                              <TableCell
                                style={{ color: "black", fontWeight: "bold" }}
                              >
                                Name
                              </TableCell>
                              <TableCell
                                style={{ color: "black", fontWeight: "bold" }}
                              >
                                Phone
                              </TableCell>
                              <TableCell
                                style={{ color: "black", fontWeight: "bold" }}
                              >
                                Rental Date
                              </TableCell>
                              <TableCell
                                style={{ color: "black", fontWeight: "bold" }}
                              >
                                Rental Time
                              </TableCell>
                              <TableCell
                                style={{ color: "black", fontWeight: "bold" }}
                              >
                                Bike ID
                              </TableCell>
                              <TableCell
                                style={{ color: "black", fontWeight: "bold" }}
                              >
                                Swaps
                              </TableCell>
                              <TableCell
                                style={{ color: "black", fontWeight: "bold" }}
                              >
                                Payments
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {rentals
                              .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                              )
                              .map((rental) => (
                                <React.Fragment key={rental.uid}>
                                  <TableRow>
                                    <TableCell className="">
                                      {rental.name}
                                    </TableCell>

                                    <TableCell>{rental.phone}</TableCell>
                                    <TableCell>{rental.rental_date}</TableCell>
                                    <TableCell>{rental.rental_time}</TableCell>
                                    <TableCell>{rental.bike_id}</TableCell>
                                    <TableCell>
                                      <Button
                                        sx={{
                                          backgroundColor: "#F7D117", // Background color
                                          color: "black", // Text color
                                          marginLeft: "8px", // Margin styling
                                          "&:hover": {
                                            backgroundColor: "#D8C410", // Optional: hover effect if you want to change the color on hover
                                          },
                                        }}
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        onClick={() =>
                                          handleSwapToggle(rental.r_id)
                                        }
                                      >
                                        {selectedSwapId === rental.r_id
                                          ? "Hide Swaps"
                                          : "Show Swaps"}
                                      </Button>
                                    </TableCell>

                                    <TableCell>
                                      <Button
                                        sx={{
                                          backgroundColor: "#F7D117", // Background color
                                          color: "black", // Text color
                                          marginLeft: "8px", // Margin styling
                                          "&:hover": {
                                            backgroundColor: "#D8C410", // Optional: hover effect if you want to change the color on hover
                                          },
                                        }}
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        onClick={() =>
                                          handlePaymentToggle(rental.r_id)
                                        }
                                      >
                                        {selectedPaymentId === rental.r_id
                                          ? "Hide Payments"
                                          : "Show Payments"}
                                      </Button>
                                    </TableCell>
                                  </TableRow>

                                  {Swaps[rental.r_id]?.length > 0 && (
                                    <TableRow>
                                      <TableCell colSpan={7}>
                                        <Collapse
                                          in={selectedSwapId === rental.r_id}
                                          timeout="auto"
                                          unmountOnExit
                                        >
                                          <Paper
                                            sx={{
                                              p: 2,
                                              backgroundColor: "#f5f5f5",
                                            }}
                                          >
                                            <Typography variant="h6">
                                              Battery Swap Details
                                            </Typography>
                                            {Swaps[rental.r_id]?.length > 0 ? (
                                              <Table size="small">
                                                <TableHead>
                                                  <TableRow className="bg-[#F7D117]">
                                                    <TableCell className="text-start">
                                                      Battery ID
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                      Swapped At
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                      Taken Location
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                      Drop Location
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                      Amount
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                      Complete
                                                    </TableCell>
                                                  </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                  {Swaps[rental.r_id]
                                                    .sort((a, b) => {
                                                      const dateA = new Date(
                                                        a.swapped_at.replace(
                                                          /(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}) (AM|PM)/,
                                                          (
                                                            _,
                                                            d,
                                                            m,
                                                            y,
                                                            h,
                                                            min,
                                                            ampm
                                                          ) =>
                                                            `${y}-${m}-${d} ${h.padStart(
                                                              2,
                                                              "0"
                                                            )}:${min} ${ampm}`
                                                        )
                                                      );
                                                      const dateB = new Date(
                                                        b.swapped_at.replace(
                                                          /(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}) (AM|PM)/,
                                                          (
                                                            _,
                                                            d,
                                                            m,
                                                            y,
                                                            h,
                                                            min,
                                                            ampm
                                                          ) =>
                                                            `${y}-${m}-${d} ${h.padStart(
                                                              2,
                                                              "0"
                                                            )}:${min} ${ampm}`
                                                        )
                                                      );
                                                      return dateB - dateA; // Descending order
                                                    })
                                                    .map((swap, index) => (
                                                      <TableRow key={index}>
                                                        <TableCell className="text-start">
                                                          {swap.battery_id}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                          {swap.swapped_at}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                          {swap.taken_location ||
                                                            "--"}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                          {swap.drop_location ||
                                                            "--"}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                          {swap.Amount}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                          {swap.complete
                                                            ? "Yes"
                                                            : "No"}
                                                        </TableCell>
                                                      </TableRow>
                                                    ))}
                                                </TableBody>
                                              </Table>
                                            ) : (
                                              <Typography>
                                                No battery swap history
                                              </Typography>
                                            )}
                                          </Paper>
                                        </Collapse>
                                      </TableCell>
                                    </TableRow>
                                  )}

                                  {payments[rental.r_id] &&
                                    payments[rental.r_id].length > 0 && (
                                      <TableRow>
                                        <TableCell colSpan={7}>
                                          <Collapse
                                            in={
                                              selectedPaymentId === rental.r_id
                                            }
                                            timeout="auto"
                                            unmountOnExit
                                          >
                                            <Paper
                                              sx={{
                                                p: 2,
                                                backgroundColor: "#f5f5f5",
                                              }}
                                            >
                                              <Typography variant="h6">
                                                Payment Details:
                                              </Typography>
                                              <Box
                                                className=" bg-[#ffffff]"
                                                sx={{
                                                  mb: 2,
                                                  p: 2,
                                                  borderRadius: 2,
                                                }}
                                              >
                                                <Typography variant="body1">
                                                  {payments[rental.r_id][0]
                                                    ?.due_amount < 0 ? (
                                                    <div className="flex w-full items-center justify-between">
                                                      <Typography variant="body1">
                                                        <strong>
                                                          Due Amount:
                                                        </strong>{" "}
                                                        ₹ {"  "}
                                                        <span className="text-2xl">
                                                          {payments[
                                                            rental.r_id
                                                          ][0]?.due_amount.toLocaleString(
                                                            "en-IN"
                                                          )}
                                                        </span>
                                                      </Typography>
                                                      <strong>
                                                        Cleared Till:{" "}
                                                        {
                                                          payments[
                                                            rental.r_id
                                                          ][0]?.due_date_cleared
                                                        }
                                                      </strong>{" "}
                                                    </div>
                                                  ) : (
                                                    <div className="flex w-full items-center justify-between">
                                                      <span className="text-[#ec1c24] text-2xl">
                                                        <strong>
                                                          Due Amount:
                                                        </strong>{" "}
                                                        ₹
                                                        {payments[
                                                          rental.r_id
                                                        ][0]?.due_amount.toLocaleString(
                                                          "en-IN"
                                                        )}
                                                      </span>
                                                      <Typography variant="body1">
                                                        <strong>
                                                          Due Date Gone:
                                                        </strong>{" "}
                                                        {
                                                          payments[
                                                            rental.r_id
                                                          ][0]?.due_date_gone
                                                        }
                                                      </Typography>
                                                    </div>
                                                  )}
                                                </Typography>
                                              </Box>

                                              {payments[rental.r_id].length >
                                              0 ? (
                                                <Table size="small">
                                                  <TableHead>
                                                    <TableRow className="bg-[#F7D117]">
                                                      <TableCell
                                                        sx={{
                                                          color: "#000",
                                                          fontWeight: "bold",
                                                        }}
                                                      >
                                                        Total Amount
                                                      </TableCell>
                                                      <TableCell
                                                        sx={{
                                                          color: "#000",
                                                          fontWeight: "bold",
                                                        }}
                                                      >
                                                        Advance Amount
                                                      </TableCell>
                                                      <TableCell
                                                        sx={{
                                                          color: "#000",
                                                          fontWeight: "bold",
                                                        }}
                                                      >
                                                        Date
                                                      </TableCell>
                                                      <TableCell
                                                        sx={{
                                                          color: "#000",
                                                          fontWeight: "bold",
                                                        }}
                                                      >
                                                        Mode of Payment
                                                      </TableCell>
                                                      <TableCell
                                                        sx={{
                                                          color: "#000",
                                                          fontWeight: "bold",
                                                        }}
                                                      >
                                                        UPI Amount
                                                      </TableCell>
                                                      <TableCell
                                                        sx={{
                                                          color: "#000",
                                                          fontWeight: "bold",
                                                        }}
                                                      >
                                                        Cash Amount
                                                      </TableCell>
                                                      <TableCell
                                                        sx={{
                                                          color: "#000",
                                                          fontWeight: "bold",
                                                        }}
                                                      >
                                                        Cheque Amount
                                                      </TableCell>
                                                    </TableRow>
                                                  </TableHead>
                                                  <TableBody>
                                                    {payments[rental.r_id]
                                                      .sort((a, b) => {
                                                        const dateA = new Date(
                                                          a.date.replace(
                                                            /(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}) (AM|PM)/,
                                                            (
                                                              _,
                                                              d,
                                                              m,
                                                              y,
                                                              h,
                                                              min,
                                                              ampm
                                                            ) =>
                                                              `${y}-${m}-${d} ${h.padStart(
                                                                2,
                                                                "0"
                                                              )}:${min} ${ampm}`
                                                          )
                                                        );
                                                        const dateB = new Date(
                                                          b.date.replace(
                                                            /(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}) (AM|PM)/,
                                                            (
                                                              _,
                                                              d,
                                                              m,
                                                              y,
                                                              h,
                                                              min,
                                                              ampm
                                                            ) =>
                                                              `${y}-${m}-${d} ${h.padStart(
                                                                2,
                                                                "0"
                                                              )}:${min} ${ampm}`
                                                          )
                                                        );
                                                        return dateB - dateA; // Descending order
                                                      })
                                                      .map((payment, index) => (
                                                        <TableRow key={index}>
                                                          <TableCell
                                                            sx={{
                                                              color: "#000",
                                                            }}
                                                          >
                                                            {
                                                              payment.total_amount
                                                            }
                                                          </TableCell>
                                                          <TableCell
                                                            sx={{
                                                              color: "#000",
                                                            }}
                                                          >
                                                            {
                                                              payment.advance_amount
                                                            }
                                                          </TableCell>
                                                          <TableCell
                                                            sx={{
                                                              color: "#000",
                                                            }}
                                                          >
                                                            {payment.date}
                                                          </TableCell>
                                                          <TableCell
                                                            sx={{
                                                              color: "#000",
                                                            }}
                                                          >
                                                            {
                                                              payment.mode_of_payment
                                                            }
                                                          </TableCell>
                                                          <TableCell
                                                            sx={{
                                                              color: "#000",
                                                            }}
                                                          >
                                                            {payment.upi_amount >
                                                            0
                                                              ? payment.upi_amount
                                                              : "-"}
                                                          </TableCell>
                                                          <TableCell
                                                            sx={{
                                                              color: "#000",
                                                            }}
                                                          >
                                                            {payment.cash_amount >
                                                            0
                                                              ? payment.cash_amount
                                                              : "-"}
                                                          </TableCell>
                                                          <TableCell
                                                            sx={{
                                                              color: "#000",
                                                            }}
                                                          >
                                                            {payment.cheque_amount >
                                                            0
                                                              ? payment.cheque_amount
                                                              : "-"}
                                                          </TableCell>
                                                        </TableRow>
                                                      ))}
                                                  </TableBody>
                                                </Table>
                                              ) : (
                                                <Typography>
                                                  No payment details available
                                                </Typography>
                                              )}
                                              <Typography
                                                variant="h6"
                                                sx={{ mt: 2 }}
                                              >
                                                Total : ₹
                                                {payments[rental.r_id]
                                                  ?.map(
                                                    (payment) =>
                                                      payment.total_amount
                                                  )
                                                  .reduce(
                                                    (acc, amount) =>
                                                      acc + amount,
                                                    0
                                                  )
                                                  .toLocaleString("en-IN")}
                                              </Typography>

                                              <Typography
                                                variant="h6"
                                                sx={{ mt: 2, mb: 1 }}
                                              >
                                                Deposit Details
                                              </Typography>
                                              {deposits[rental.r_id] &&
                                              deposits[rental.r_id].length >
                                                0 ? (
                                                <Table size="small">
                                                  <TableHead>
                                                    <TableRow className="bg-[#F7D117]">
                                                      <TableCell>
                                                        Date
                                                      </TableCell>
                                                      <TableCell>
                                                        Reason
                                                      </TableCell>
                                                      <TableCell>
                                                        Deposit Amount
                                                      </TableCell>
                                                      <TableCell>
                                                        Mode of Deposit
                                                      </TableCell>
                                                      <TableCell>
                                                        UPI Amount
                                                      </TableCell>
                                                      <TableCell>
                                                        Cash Amount
                                                      </TableCell>
                                                      <TableCell>
                                                        Cheque Amount
                                                      </TableCell>
                                                    </TableRow>
                                                  </TableHead>
                                                  <TableBody>
                                                    {deposits[rental.r_id].map(
                                                      (deposit, index) => (
                                                        <TableRow key={index}>
                                                          <TableCell>
                                                            {deposit.date}
                                                          </TableCell>
                                                          <TableCell>
                                                            {deposit.reason}
                                                          </TableCell>
                                                          <TableCell>
                                                            {
                                                              deposit.deposit_amount
                                                            }
                                                          </TableCell>
                                                          <TableCell>
                                                            {
                                                              deposit.mode_of_deposit
                                                            }
                                                          </TableCell>
                                                          <TableCell>
                                                            {deposit.upi_amount}
                                                          </TableCell>
                                                          <TableCell>
                                                            {
                                                              deposit.cash_amount
                                                            }
                                                          </TableCell>
                                                          <TableCell>
                                                            {
                                                              deposit.cheque_amount
                                                            }
                                                          </TableCell>
                                                        </TableRow>
                                                      )
                                                    )}
                                                  </TableBody>
                                                </Table>
                                              ) : (
                                                <Typography>
                                                  No deposit details available
                                                </Typography>
                                              )}
                                            </Paper>
                                          </Collapse>
                                        </TableCell>
                                      </TableRow>
                                    )}
                                </React.Fragment>
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>

                    <TablePagination
                      rowsPerPageOptions={[10, 25, 50]}
                      component="div"
                      count={rentals.length}
                      rowsPerPage={rowsPerPage2}
                      page={page2}
                      onPageChange={handleChangePage2}
                      onRowsPerPageChange={handleChangeRowsPerPage2}
                    />
                  </Card>
                </div>
              </>
            ) : (
              <Typography className="text-center" variant="h6">
                No Rental Data Available. Go to{" "}
                <span
                  className="text-blue-500 cursor-pointer underline"
                  onClick={() => navigate("/deliveryboy")}
                >
                  Delivery Boy
                </span>
              </Typography>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default DeliveryTodaysBusiness;
