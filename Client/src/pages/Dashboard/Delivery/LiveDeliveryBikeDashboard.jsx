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
  Box,
} from "@mui/material";
import { API_URL } from "../../../config";
const LiveDeliveryBikeDashboard = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSwapId, setSelectedSwapId] = useState(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [payments, setPayments] = useState({});
  const [Swaps, setSwaps] = useState({});
  const [deposits, setDeposits] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetch(`http://${API_URL}/Delivery-Admin/ActiveRentalDelivery/`)
      .then((response) => response.json())
      .then((data) => {
        setRentals(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

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

    fetch(
      `http://${API_URL}/Delivery-Admin/ActiveBatterySwapsAPI/${rentalId}/`
    )
      .then((response) => response.json())
      .then((data) => {
        setSwaps((prev) => ({ ...prev, [rentalId]: data.battery_swaps }));
      })
      .catch((error) => console.error("Error fetching swap details:", error));
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="bg-white flex flex-col  h-screen p-6">
      <Typography
        variant="h4"
        className="font-semibold mb-4"
        style={{ color: "gray" }}
      >
        <span style={{ color: "#F7D117" }}>Live Delivery</span> Dashboard
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Card
          className="shadow-lg"
          style={{ borderRadius: "12px", border: "1px solid #ddd" }}
        >
          <CardContent style={{ maxHeight: "60vh", overflowY: "auto" }}>
            <TableContainer
              component={Paper}
              style={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}
            >
              <Table>
                <TableHead style={{ backgroundColor: "#F7D117" }}>
                  <TableRow>
                    <TableCell style={{ color: "black", fontWeight: "bold" }}>
                      Name
                    </TableCell>
                    <TableCell style={{ color: "black", fontWeight: "bold" }}>
                      Phone
                    </TableCell>
                    <TableCell style={{ color: "black", fontWeight: "bold" }}>
                      Rental Date
                    </TableCell>
                    <TableCell style={{ color: "black", fontWeight: "bold" }}>
                      Rental Time
                    </TableCell>
                    <TableCell style={{ color: "black", fontWeight: "bold" }}>
                      Bike ID
                    </TableCell>
                    <TableCell style={{ color: "black", fontWeight: "bold" }}>
                      Package
                    </TableCell>
                    <TableCell style={{ color: "black", fontWeight: "bold" }}>
                      Rented By
                    </TableCell>
                    <TableCell style={{ color: "black", fontWeight: "bold" }}>
                      Swaps
                    </TableCell>
                    <TableCell style={{ color: "black", fontWeight: "bold" }}>
                      Payments
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rentals
                    .sort((a, b) => {
                      const dateA = new Date(
                        `${a.rental_date} ${a.rental_time}`
                      );
                      const dateB = new Date(
                        `${b.rental_date} ${b.rental_time}`
                      );
                      return dateB - dateA;
                    })
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((rental) => (
                      <React.Fragment key={rental.uid}>
                        <TableRow>
                          <TableCell className="relative">
                            {rental.name}
                            {/* <span
                              className={`absolute top-6 right-10 h-3 w-3 rounded-full ${
                                Number(payments[rental.r_id] &&
                                  payments[rental.r_id].length > 0 && payments[rental.r_id][0].due_amount) > 0
                                  ? "bg-red-500"
                                  : "bg-green-500"
                              }`}
                            ></span> */}
                          </TableCell>

                          <TableCell>{rental.phone}</TableCell>
                          <TableCell>{rental.rental_date}</TableCell>
                          <TableCell>{rental.rental_time}</TableCell>
                          <TableCell>{rental.bike_id}</TableCell>
                          <TableCell>{rental.package}</TableCell>
                          <TableCell>{rental.rented_by || "N/A"}</TableCell>
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
                              onClick={() => handleSwapToggle(rental.r_id)}
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
                              onClick={() => handlePaymentToggle(rental.r_id)}
                            >
                              {selectedPaymentId === rental.r_id
                                ? "Hide Payments"
                                : "Show Payments"}
                            </Button>
                          </TableCell>
                        </TableRow>

                        {Swaps[rental.r_id]?.length > 0 && (
                          <TableRow className=''>
                            <TableCell colSpan={9}>
                              <Collapse
                                in={selectedSwapId === rental.r_id}
                                timeout="auto"
                                unmountOnExit
                              >
                                <Paper
                                  sx={{ p: 2,width: "100%", backgroundColor: "#f5f5f5" }}
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
                                          <TableCell className="text-start">
                                            Swaped By
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
                                                (_, d, m, y, h, min, ampm) =>
                                                  `${y}-${m}-${d} ${h.padStart(
                                                    2,
                                                    "0"
                                                  )}:${min} ${ampm}`
                                              )
                                            );
                                            const dateB = new Date(
                                              b.swapped_at.replace(
                                                /(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}) (AM|PM)/,
                                                (_, d, m, y, h, min, ampm) =>
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
                                              <TableCell className="text-start">
                                                {swap.swap_by}
                                              </TableCell>
                                              <TableCell className="text-center">
                                                {swap.swapped_at}
                                              </TableCell>
                                              <TableCell className="text-center">
                                                {swap.taken_location || "--"}
                                              </TableCell>
                                              <TableCell className="text-center">
                                                {swap.drop_location || "--"}
                                              </TableCell>
                                              <TableCell className="text-center">
                                                {swap.Amount}
                                              </TableCell>
                                              <TableCell className="text-center">
                                                {swap.complete ? "Yes" : "No"}
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
                            <TableRow
                            sx={{ backgroundColor: "#f5f5f5" ,width:"100%" }}
                            >
                              <TableCell colSpan={9}>
                                <Collapse
                                  in={selectedPaymentId === rental.r_id}
                                  timeout="auto"
                                  unmountOnExit
                                >
                                  <Paper
                                    sx={{ p: 2, backgroundColor: "#f5f5f5" }}
                                  >
                                    <Typography variant="h6">
                                      Payment Details:
                                    </Typography>
                                    <Box
                                      className=" bg-[#ffffff]"
                                      sx={{ mb: 2, p: 2, borderRadius: 2 }}
                                    >
                                      <Typography variant="body1">
                                        {payments[rental.r_id][0]?.due_amount <=
                                        0 ? (
                                          <div className="flex w-full items-center justify-between">
                                            <Typography variant="body1">
                                              <strong>Due Amount:</strong> ₹{" "}
                                              {"  "}
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
                                                payments[rental.r_id][0]
                                                  ?.due_date_cleared
                                              }
                                            </strong>{" "}
                                          </div>
                                        ) : (
                                          <div className="flex w-full items-center justify-between">
                                            <span className="text-[#ec1c24] text-2xl">
                                              <strong>Due Amount:</strong> ₹
                                              {payments[
                                                rental.r_id
                                              ][0]?.due_amount.toLocaleString(
                                                "en-IN"
                                              )}
                                            </span>
                                            <Typography variant="body1">
                                              <strong>Due Date Gone:</strong>{" "}
                                              {
                                                payments[rental.r_id][0]
                                                  ?.due_date_gone
                                              }
                                            </Typography>
                                          </div>
                                        )}
                                      </Typography>
                                    </Box>

                                    {payments[rental.r_id].length > 0 ? (
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
                                                  (_, d, m, y, h, min, ampm) =>
                                                    `${y}-${m}-${d} ${h.padStart(
                                                      2,
                                                      "0"
                                                    )}:${min} ${ampm}`
                                                )
                                              );
                                              const dateB = new Date(
                                                b.date.replace(
                                                  /(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}) (AM|PM)/,
                                                  (_, d, m, y, h, min, ampm) =>
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
                                                  sx={{ color: "#000" }}
                                                >
                                                  {payment.total_amount}
                                                </TableCell>
                                                <TableCell
                                                  sx={{ color: "#000" }}
                                                >
                                                  {payment.advance_amount}
                                                </TableCell>
                                                <TableCell
                                                  sx={{ color: "#000" }}
                                                >
                                                  {formatDate(payment.date)}
                                                </TableCell>
                                                <TableCell
                                                  sx={{ color: "#000" }}
                                                >
                                                  {payment.mode_of_payment}
                                                </TableCell>
                                                <TableCell
                                                  sx={{ color: "#000" }}
                                                >
                                                  {payment.upi_amount > 0
                                                    ? payment.upi_amount
                                                    : "-"}
                                                </TableCell>
                                                <TableCell
                                                  sx={{ color: "#000" }}
                                                >
                                                  {payment.cash_amount > 0
                                                    ? payment.cash_amount
                                                    : "-"}
                                                </TableCell>
                                                <TableCell
                                                  sx={{ color: "#000" }}
                                                >
                                                  {payment.cheque_amount > 0
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
                                    <Typography variant="h6" sx={{ mt: 2 }}>
                                      Total : ₹
                                      {payments[rental.r_id]
                                        ?.map((payment) => payment.total_amount)
                                        .reduce(
                                          (acc, amount) => acc + amount,
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
                                    deposits[rental.r_id].length > 0 ? (
                                      <Table size="small">
                                        <TableHead>
                                          <TableRow className="bg-[#F7D117]">
                                            <TableCell>Date</TableCell>
                                            <TableCell>Reason</TableCell>
                                            <TableCell>
                                              Deposit Amount
                                            </TableCell>
                                            <TableCell>
                                              Mode of Deposit
                                            </TableCell>
                                            <TableCell>UPI Amount</TableCell>
                                            <TableCell>Cash Amount</TableCell>
                                            <TableCell>Cheque Amount</TableCell>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {deposits[rental.r_id].map(
                                            (deposit, index) => (
                                              <TableRow key={index}>
                                                <TableCell>
                                                  {formatDate(deposit.date)}
                                                </TableCell>
                                                <TableCell>
                                                  {deposit.reason}
                                                </TableCell>
                                                <TableCell>
                                                  {deposit.deposit_amount}
                                                </TableCell>
                                                <TableCell>
                                                  {deposit.mode_of_deposit}
                                                </TableCell>
                                                <TableCell>
                                                  {deposit.upi_amount}
                                                </TableCell>
                                                <TableCell>
                                                  {deposit.cash_amount}
                                                </TableCell>
                                                <TableCell>
                                                  {deposit.cheque_amount}
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
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      )}
    </div>
  );
};

export default LiveDeliveryBikeDashboard;

const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0"); // Pad single digit days
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
};
