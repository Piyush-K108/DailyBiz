import React, { useState, useEffect } from "react";
import BikeInfoCard from "../../components/bike-info-component/BikeinfoCard";
import StatBox from "../../components/bike-info-component/StatsOfbikes";
import MopedIcon from "@mui/icons-material/Moped";
import AddIcon from "@mui/icons-material/Add";
import EnhancedEncryptionIcon from "@mui/icons-material/EnhancedEncryption";
import { API_URL } from "../../config";
import ElectricMopedIcon from "@mui/icons-material/ElectricMoped";
import LoadingAnimation from "../../components/LoadingAnimation";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import * as XLSX from "xlsx";
import MyDatePicker from "../../components/DatePicker";
import { useNavigate } from "react-router-dom";
import MonthlyExcelDownloader from "../../components/MonthlyExcelDownloader";
function TodaysBusiness() {
  const [bikeData, setBikeData] = useState({ Normal: [], Count: [] });
  const [hoveredData, setHoveredData] = useState(null);
  const [TodayDetails, setTodayDetails] = useState([]);
  const [Real, setReal] = useState([]);
  const [User, setUser] = useState([]);
  const [Realcash_upi, setRealcash_upi] = useState([]);

  const [deposits, setDeposits] = useState([]);
  const [totalUPI, setTotalUPI] = useState(0);
  const [totalCash, setTotalCash] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();

  const handleDownloadExcel = () => {
    const dataForExcel = [
      [
        "Bike_ID",
        "Rental_date",
        "Return_date",
        "Rental_date_time",
        "Return_date_time",
        "KM_Went",
        "KM_Came",
        "KM_For",
        "Hours",
        "Minutes",
        "Decimal_Hours",
        "Amount",
        "Advance",
        "FinalAmount",
        "Mode",
        "Discount",
        "Tip",
        "License",
        "Customer_Name",
        "Contact",
        "Review/Follow",
      ],
      ...TodayDetails.map((bike, index) => [
        bike.bike_id,
        bike.Rental_date,
        bike.Return_date,
        bike.Rental_date_time,
        bike.Return_date_time,
        bike.KM_Went,
        bike.KM_For + bike.KM_Went,
        bike.KM_For,
        bike.hours,
        bike.minutes,
        bike.decimal_hours,
        bike.Amount,
        bike.Advance,
        bike.Amount - bike.Discount + bike.Tip,
        bike.Mode,
        bike.Discount,
        bike.Tip,
        bike.Plate,
        User && User.length > 0 && User[index] ? User[index].name : null,
        User && User.length > 0 && User[index] ? User[index].phone : null,
        User && User.length > 0 && User[index]
          ? User[index].taken === false
            ? "No"
            : User[index].taken === true
            ? "Yes"
            : User[index].taken
          : null,
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(dataForExcel);
    ws["!cols"] = Array(dataForExcel[0].length).fill({ wch: 18 });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");

    XLSX.writeFile(wb, `todays_business_${selectedDate}.xlsx`);
  };

  const [loading, setLoading] = useState(true);
  const [Dataloading, setDataLoading] = useState([]);
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
  const day = String(today.getDate()).padStart(2, "0");

  const formattedToday = `${year}-${month}-${day}`;

  const [selectedDate, setSelectedDate] = useState(formattedToday);

  const handleDateChange = (date) => {
    setDataLoading(true);
    setSelectedDate(date);
  };

  useEffect(() => {
    fetchData();
    fetchDetails();
    fetchRevenue();
    fetchReal();
    fetchDeposits();
  }, [selectedDate]);

  const handleMouseEnter = (data) => {
    setHoveredData(data);
  };

  const handleMouseLeave = () => {
    setHoveredData(null);
  };
  const fetchReal = async () => {
    try {
      const response = await fetch(
        `http://${API_URL}/Admin/Todays_Revenu_Exel_Real/${selectedDate}/`
      );
      const data = await response.json();

      setReal(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchDeposits = async () => {
    fetch("http://${API_URL}/Admin/deposite/?date=" + selectedDate)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDeposits(data.data);
          setTotalUPI(data.totalUPI);
          setTotalCash(data.totalCash);
          setTotalAmount(data.totalAmount);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching deposits:", error);
        setLoading(false);
      });
  };
  const fetchData = async () => {
    try {
      const response = await fetch(`http://${API_URL}/Admin/Bike_Data/`);
      const data = await response.json();
      setBikeData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDetails = async () => {
    try {
      const response = await fetch(
        `http://${API_URL}/Admin/Todays_Revenu_Exel/${selectedDate}/`
      );
      const data = await response.json();

      setTodayDetails(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const findUserById = (id) => {
    return User.find((user) => user.id === id) || {};
  };

  const fetchRevenue = async () => {
    try {
      // First API call
      const response2 = await fetch(
        `http://${API_URL}/Admin/Exel_User/${selectedDate}/`
      );
      const data2 = await response2.json();
      setUser(data2);

      // Second API call
      const response3 = await fetch(
        `http://${API_URL}/Admin/Cash_qr_Real/${selectedDate}/`
      );
      const data3 = await response3.json();
      setRealcash_upi(data3);

      // Update loading states
      setLoading(false);
      setDataLoading(false);
    } catch (error) {
      // Handle errors for the first API call

      console.error("Error fetching Exel_User data:", error);

      try {
        // Retry second API call in case of the first one fails
        const response3 = await fetch(
          `http://${API_URL}/Admin/Cash_qr_Real/${selectedDate}/`
        );
        const data3 = await response3.json();
        setRealcash_upi(data3);
        setLoading(false);
        setDataLoading(false);
      } catch (error) {
        // Handle errors for the second API call
        setDataLoading(false);
        setLoading(false);
        setDataLoading(false);
        console.error("Error fetching Cash_qr_Real data:", error);
      }
    }
  };
  const getRowClass = (feedback) => {
    switch (feedback) {
      case "Wrong":
        return "bg-red-500"; // Red for Wrong
      case "Correct":
        return "bg-green-500"; // Green for Correct
      default:
        return ""; // No specific color
    }
  };
  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (hours === 12) {
      hours = 0;
    }
    if (modifier === "PM") {
      hours += 12;
    }

    // Return the total minutes since midnight for easy comparison
    return hours * 60 + minutes;
  };
  const copyColumnValues = (item, columnKey) => {
    let columnValues = "";

    if (item === "bike") {
      columnValues = TodayDetails.sort((a, b) => {
        const timeA = convertTo24Hour(a.Return_date_time);
        const timeB = convertTo24Hour(b.Return_date_time);
        return timeA - timeB;
      })
        .map((bike) => {
          if (columnKey === "Amount") {
            return (
              bike.Amount -
              (bike.Discount || 0) +
              (bike.Tip || 0)
            );
          }
          return bike[columnKey] || "N/A";
        })
        .join("\n");
    } else if (item === "User") {
      columnValues = TodayDetails.sort((a, b) => {
        const timeA = convertTo24Hour(a.Return_date_time);
        const timeB = convertTo24Hour(b.Return_date_time);
        return timeA - timeB;
      })
        .map((bike) => {
          const user = findUserById(bike.id);
          return user && user[columnKey] ? user[columnKey] : "N/A";
        })
        .join("\n");
    }

    if (columnValues) {
      navigator.clipboard
        .writeText(columnValues)
        .then(() => {
          alert(`${columnKey} column copied to clipboard!`);
        })
        .catch((err) => console.error("Copy failed", err));
    } else {
      alert("No data available to copy.");
    }
  };

  return (
    <div className="bg-white flex flex-col  h-[100%] ">
      {loading ? ( // Display loading animation when loading is true
        <LoadingAnimation title="Loading...." />
      ) : (
        <>
          <div className="flex  sm:flex-row justify-between sm:items-center mr-10 ml-8 mt-5">
            <MyDatePicker onDateChange={handleDateChange} />
            <div className="flex flex-row  items-center cursor-pointer sm:mt-0 ">
              <div className="space-x-10 flex flex-row ">
                <h1
                  onClick={handleDownloadExcel}
                  className="hover:text-yellow-500 hover:underline hidden sm:block"
                >
                  <CloudDownloadIcon className="mr-4 hover:text-yellow-400 " />
                  Download Today's Excel
                </h1>
                <MonthlyExcelDownloader />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5 ml-3 mr-6 sm:ml-10  items-center sm:grid-cols-4  mt-10 ">
            <StatBox
              title="Total Bikes"
              value={bikeData.Normal.length}
              icon2={<AddIcon fontSize="0" />}
            />
            <StatBox
              title="Total KM Petrol"
              value={TodayDetails.filter(
                (item) => !item.bike_id.startsWith("B")
              ).reduce((sum, item) => sum + item.KM_For, 0)}
              icon2={<ElectricMopedIcon fontSize="0" />}
            />
            <StatBox
              title="Total KM ELectric"
              value={TodayDetails.filter((item) =>
                item.bike_id.startsWith("B")
              ).reduce((sum, item) => sum + item.KM_For, 0)}
              icon2={<MopedIcon fontSize="0" />}
            />
            <StatBox
              title="Total Bikes on Rent"
              value={bikeData.Normal.filter((bike) => bike.is_assigned).length}
              icon2={<EnhancedEncryptionIcon fontSize="0" />}
            />
          </div>
          <h1 className="mt-4 ml-8 text-black font-bold capitalize">
            Total Real{" "}
          </h1>

          <div className=" p-2 mt-8 ml-8 mr-8 mb-8 rounded-lg shadow-lg ">
            {Dataloading ? (
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
                    <BikeInfoCard
                      title="Cash"
                      data={Realcash_upi.cash_amount}
                    />
                  </div>

                  <div className="border-r md:border-r-0   h-350px">
                    <BikeInfoCard
                      title="Online QR"
                      data={`${Realcash_upi.qr_amount}`}
                    />
                  </div>

                  {/* Current KM Reading */}
                  <div className="border-r md:border-r-0 ">
                    <BikeInfoCard
                      title="Online Phone"
                      data={`${Realcash_upi.number_amount}`}
                    />
                  </div>

                  <div className="border-r md:border-r-0 ">
                    <BikeInfoCard title="EV" data={Real.EVAmount} />
                  </div>

                  <div className="border-r md:border-r-0 ">
                    <BikeInfoCard title="Petrol" data={Real.PetrolAmount} />
                  </div>

                  <div className="border-r md:border-r-0 ">
                    <BikeInfoCard
                      title="Attached Petrol"
                      data={Real.AttachedPetrol}
                    />
                  </div>
                  <div className="border-r md:border-r-0   h-350px">
                    <BikeInfoCard
                      title="Non Attached Petrol"
                      data={Real.NotAttachedPetrol}
                    />
                  </div>

                  <div className="border-r md:border-r-0 ">
                    <BikeInfoCard title="All Bikes" data={Real.All_Activa} />
                  </div>
                </div>

                <div className="border-r md:border-r-0 ">
                  <BikeInfoCard title="Middel Pay UPI" data={totalUPI} />
                </div>

                <div className="border-r md:border-r-0 ">
                  <BikeInfoCard title="Middel Pay Cash" data={totalCash} />
                </div>
                <div className="border-r md:border-r-0   h-350px">
                  <BikeInfoCard title="Middel Pay Total" data={totalAmount} />
                </div>
              </>
            )}
          </div>

          {/* <h1 className="mt-4 ml-8 text-black font-bold capitalize">
            Total Today{" "}
          </h1>

          <div className=" p-2 mt-8 ml-8 mr-8 mb-8   rounded-lg shadow-lg ">
            {Dataloading ? ( // Display loading animation when loading is true
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

                  <div className="border-r md:border-r-0   h-350px">
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
                  <div className="border-r md:border-r-0   h-350px">
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

          <div className="flex-1 container mx-auto p-4">
            <h1 className="mt-4  text-[#212121] font-bold capitalize">
              Today's Rents{" "}
            </h1>

            {Dataloading ? ( // Display loading animation when loading is true
              <div className=" p-2 mt-8 ml-8 mr-8 mb-8 rounded-lg shadow-lg ">
                <div className="flex justify-center items-center flex-row gap-3">
                  <div className="w-4 h-4 rounded-full  bg-yellow-400 animate-bounce"></div>
                  <div className="w-4 h-4 rounded-full bg-yellow-400 animate-bounce [animation-delay:-.3s]"></div>
                  <div className="w-4 h-4 rounded-full bg-yellow-400 animate-bounce [animation-delay:-.3s]"></div>
                  <div className="w-4 h-4 rounded-full bg-yellow-400 animate-bounce [animation-delay:-.3s]"></div>
                  <div className="w-4 h-4 rounded-full bg-yellow-400 animate-bounce [animation-delay:-.5s]"></div>
                </div>
              </div>
            ) : (
              <>
                <div className=" shadow-md rounded my-6  overflow-x-auto ">
                  <TableContainer component={Paper}>
                    <Table className="bg-dimWhite cursor-pointer rounded-lg shadow-lg min-w-full">
                      <TableHead>
                        <TableRow>
                          <TableCell className="px-6 py-3 text-left bg-yellow-500 font-bold text-black md:text-lg lg:text-xl xl:text-2xl border-r w-1/6 border-yellow-700">
                            S.NO.
                          </TableCell>
                          <TableCell
                            onClick={() => copyColumnValues("bike", "bike_id")}
                            className="px-6 py-3 text-left bg-yellow-500 font-bold text-yellow md:text-lg lg:text-xl xl:text-2xl border-r w-1/6 border-yellow-700"
                          >
                            Bike_ID
                          </TableCell>

                          <TableCell className="px-6 py-3 text-left bg-yellow-500 font-bold text-black md:text-lg lg:text-xl xl:text-2xl border-r w-1/6 border-yellow-700">
                            KM_Went
                          </TableCell>
                          <TableCell className="px-6 py-3 text-left bg-yellow-500 font-bold text-black md:text-lg lg:text-xl xl:text-2xl border-r w-1/6 border-yellow-700">
                            KM_Came
                          </TableCell>
                          <TableCell className="px-6 py-3 text-left bg-yellow-500 font-bold text-black md:text-lg lg:text-xl xl:text-2xl border-r w-1/6 border-yellow-700">
                            KM_For
                          </TableCell>
                          <TableCell className="px-6 py-3 text-left bg-yellow-500 font-bold text-black md:text-lg lg:text-xl xl:text-2xl border-r w-1/6 border-yellow-700">
                            Rental_date
                          </TableCell>

                          <TableCell className="px-6 py-3 text-left bg-yellow-500 font-bold text-black md:text-lg lg:text-xl xl:text-2xl border-r w-1/6 border-yellow-700">
                            Return_date
                          </TableCell>
                          <TableCell className="px-6 py-3 text-left bg-yellow-500 font-bold text-black md:text-lg lg:text-xl xl:text-2xl border-r w-1/6 border-yellow-700">
                            Rental_time
                          </TableCell>

                          <TableCell className="px-6 py-3 text-left bg-yellow-500 font-bold text-black md:text-lg lg:text-xl xl:text-2xl border-r w-1/6 border-yellow-700">
                            Return_time
                          </TableCell>

                          <TableCell className="px-6 py-3 text-left bg-yellow-500 font-bold text-black md:text-lg lg:text-xl xl:text-2xl border-r w-1/6 border-yellow-700">
                            Hours:Minutes
                          </TableCell>
                          <TableCell className="px-6 py-3 text-left bg-yellow-500 font-bold text-black md:text-lg lg:text-xl xl:text-2xl border-r w-1/6 border-yellow-700">
                            Decimal_Hours
                          </TableCell>
                          <TableCell className="px-6 py-3 text-left bg-yellow-500 font-bold text-black md:text-lg lg:text-xl xl:text-2xl border-r w-1/6 border-yellow-700">
                            Amount
                          </TableCell>
                          <TableCell className="px-6 py-3 text-left bg-yellow-500 font-bold text-black md:text-lg lg:text-xl xl:text-2xl border-r w-1/6 border-yellow-700">
                            Advance
                          </TableCell>
                          <TableCell
                            onClick={() => copyColumnValues("bike", "Amount")}
                            className="px-6 py-3 text-left bg-yellow-500 font-bold text-black md:text-lg lg:text-xl xl:text-2xl border-r w-1/6 border-yellow-700"
                          >
                            FinalAmount
                          </TableCell>
                          <TableCell className="px-6 py-3 text-left bg-yellow-500 font-bold text-black md:text-lg lg:text-xl xl:text-2xl border-r w-1/6 border-yellow-700">
                            Discount
                          </TableCell>
                          <TableCell className="px-6 py-3 text-left bg-yellow-500 font-bold text-black md:text-lg lg:text-xl xl:text-2xl border-r w-1/6 border-yellow-700">
                            Tip
                          </TableCell>
                          <TableCell className="px-6 py-3 text-left bg-yellow-500 font-bold text-black md:text-lg lg:text-xl xl:text-2xl border-r w-1/6 border-yellow-700">
                            Mode
                          </TableCell>
                          <TableCell
                            onClick={() => copyColumnValues("User", "name")}
                            className="px-6 py-3 text-left bg-yellow-500 font-bold text-black md:text-lg lg:text-xl xl:text-2xl border-r w-1/6 border-yellow-700"
                          >
                            Customer_Name
                          </TableCell>
                          <TableCell
                            onClick={() => copyColumnValues("User", "phone")}
                            className="px-6 py-3 text-left bg-yellow-500 font-bold text-black md:text-lg lg:text-xl xl:text-2xl border-r w-1/6 border-yellow-700"
                          >
                            Contact
                          </TableCell>
                          <TableCell className="px-6 py-3 text-left bg-yellow-500 font-bold text-black md:text-lg lg:text-xl xl:text-2xl border-r w-1/6 border-yellow-700">
                            Follow/Review
                          </TableCell>
                          <TableCell className="px-6 py-3 text-left bg-yellow-500 font-bold text-black md:text-lg lg:text-xl xl:text-2xl border-r w-1/6 border-yellow-700">
                            Feedback
                          </TableCell>
                          <TableCell className="px-6 py-3 text-left bg-yellow-500 font-bold text-black md:text-lg lg:text-xl xl:text-2xl border-r w-1/6 border-yellow-700">
                            Rented_By
                          </TableCell>
                          <TableCell className="px-6 py-3 text-left bg-yellow-500 font-bold text-black md:text-lg lg:text-xl xl:text-2xl border-r w-1/6 border-yellow-700">
                            Deposited_By
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {TodayDetails.sort((a, b) => {
                          const timeA = convertTo24Hour(a.Return_date_time);
                          const timeB = convertTo24Hour(b.Return_date_time);

                          return timeA - timeB;
                        }).map((bike, index) => {
                          const user = findUserById(bike.id);

                          return (
                            <TableRow
                              onDoubleClick={() => {
                                console.log(index);
                                navigate(
                                  `/Bills/${user?.phone}/${selectedDate}/`,
                                  {
                                    state: {
                                      phone: user?.phone,
                                      date: selectedDate,
                                      Data: bike,
                                      index: index,
                                    },
                                  }
                                );
                              }}
                              key={bike.id}
                              className={`hover:bg-gray-200 ${
                                bike.bike_id === hoveredData
                                  ? "bg-gray-200"
                                  : ""
                              }`}
                            >
                              <TableCell className="px-6 border-r border-gray py-6 cursor-pointer">
                                {bike.id}
                              </TableCell>

                              <TableCell className="px-6 border-r border-gray py-6">
                                <div
                                  className="flex items-center"
                                  onMouseEnter={() =>
                                    handleMouseEnter(bike.bike_id)
                                  }
                                  onMouseLeave={handleMouseLeave}
                                >
                                  <span className="mr-4 ">{bike.bike_id}</span>
                                </div>
                              </TableCell>

                              <TableCell className="px-6 border-r h-20 border-gray py-6">
                                {bike.KM_Went}
                              </TableCell>

                              <TableCell className="px-6 border-r h-20 border-gray py-6">
                                {bike.KM_For > 0
                                  ? bike.KM_For + bike.KM_Went
                                  : "ON Rent"}
                              </TableCell>

                              <TableCell className="px-6 border-r h-20 border-gray py-6">
                                {bike.KM_For}
                              </TableCell>

                              <TableCell className="px-6 border-r h-20 border-gray py-6">
                                {bike.Rental_date}
                              </TableCell>

                              <TableCell className="px-6 border-r h-20 border-gray py-6">
                                {bike.Return_date}
                              </TableCell>

                              <TableCell className="px-6 border-r h-20 border-gray py-6">
                                {bike.Rental_date_time}
                              </TableCell>

                              <TableCell className="px-6 border-r h-20 border-gray py-6">
                                {bike.Return_date_time}
                              </TableCell>

                              <TableCell className="px-6 border-r h-20 border-gray py-6">
                                {`${bike.hours}:${bike.minutes}`}
                              </TableCell>

                              <TableCell className="px-6 border-r h-20 border-gray py-6">
                                {bike.decimal_hours}
                              </TableCell>

                              <TableCell className="px-6 border-r h-20 border-gray py-6">
                                {bike.Amount}
                              </TableCell>

                              <TableCell className="px-6 border-r h-20 border-gray py-6">
                                {bike.Advance}
                              </TableCell>

                              <TableCell className="px-6 border-r h-20 border-gray py-6">
                                {(
                                  bike.Amount -
                                  (bike.Discount || 0) +
                                  (bike.Tip || 0)
                                )}
                              </TableCell>

                              <TableCell className="px-6 border-r h-20 border-gray py-6">
                                {bike.Discount}
                              </TableCell>

                              <TableCell className="px-6 border-r h-20 border-gray py-6">
                                {bike.Tip}
                              </TableCell>

                              <TableCell className="px-6 border-r h-20 border-gray py-6">
                                {bike.Mode}
                              </TableCell>

                              {/* Render user-related columns */}
                              <TableCell className="px-6 border-r h-20 border-gray py-6">
                                {user.name || "N/A"}
                              </TableCell>

                              <TableCell className="px-6 border-r h-20 border-gray py-6">
                                {user.phone || "N/A"}
                              </TableCell>

                              <TableCell className="px-6 border-r h-20 border-gray py-6">
                                {user.taken === false
                                  ? "No"
                                  : user.taken === true
                                  ? "Yes"
                                  : "N/A"}
                              </TableCell>

                              <TableCell className="px-6 border-r h-20 border-gray py-6">
                                {user.feedback || "N/A"}
                              </TableCell>
                              <TableCell className="px-6 border-r h-20 border-gray py-6">
                                {user.Staff_rent || "N/A"}
                              </TableCell>
                              <TableCell className="px-6 border-r h-20 border-gray py-6">
                                {user.Staff_deposite || "N/A"}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </>
            )}

            <h1 className="mt-4  text-[#212121] font-bold capitalize">
              Today's Middel Payments{" "}
            </h1>
            {Dataloading ? ( // Display loading animation when loading is true
              <div className=" p-2 mt-8 ml-8 mr-8 mb-8 rounded-lg shadow-lg ">
                <div className="flex justify-center items-center flex-row gap-3">
                  <div className="w-4 h-4 rounded-full  bg-yellow-400 animate-bounce"></div>
                  <div className="w-4 h-4 rounded-full bg-yellow-400 animate-bounce [animation-delay:-.3s]"></div>
                  <div className="w-4 h-4 rounded-full bg-yellow-400 animate-bounce [animation-delay:-.3s]"></div>
                  <div className="w-4 h-4 rounded-full bg-yellow-400 animate-bounce [animation-delay:-.3s]"></div>
                  <div className="w-4 h-4 rounded-full bg-yellow-400 animate-bounce [animation-delay:-.5s]"></div>
                </div>
              </div>
            ) : (
              <>
                <div className=" shadow-md rounded my-6  overflow-x-auto ">
                  <TableContainer component={Paper}>
                    <Table className="bg-dimWhite cursor-pointer rounded-lg shadow-lg min-w-full">
                      <TableHead>
                        <TableRow>
                          <TableCell className="px-6 py-3 text-left bg-yellow-500 font-bold text-black border-r w-1/6 border-yellow-700">
                            Bike Number
                          </TableCell>
                          <TableCell className="px-6 py-3 text-left bg-yellow-500 font-bold text-black border-r w-1/6 border-yellow-700">
                            User Name
                          </TableCell>
                          <TableCell className="px-6 py-3 text-left bg-yellow-500 font-bold text-black border-r w-1/6 border-yellow-700">
                            UPI
                          </TableCell>
                          <TableCell className="px-6 py-3 text-left bg-yellow-500 font-bold text-black border-r w-1/6 border-yellow-700">
                            Cash
                          </TableCell>
                          <TableCell className="px-6 py-3 text-left bg-yellow-500 font-bold text-black border-r w-1/6 border-yellow-700">
                            Total Amount
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {deposits.map((deposit) => (
                          <TableRow
                            key={deposit.id}
                            className="hover:bg-gray-100"
                          >
                            <TableCell className="px-6 py-4 border-r">
                              {deposit.r_id.bike}
                            </TableCell>
                            <TableCell className="px-6 py-4 border-r">
                              {deposit.r_id.user.name}
                            </TableCell>
                            <TableCell className="px-6 py-4 border-r">
                              {deposit.upi}
                            </TableCell>
                            <TableCell className="px-6 py-4 border-r">
                              {deposit.cash}
                            </TableCell>
                            <TableCell className="px-6 py-4 border-r">
                              {deposit.Amount}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default TodaysBusiness;
