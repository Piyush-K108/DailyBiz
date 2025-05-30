import React, { useState, useEffect } from "react";
import StatBox from "../../components/bike-info-component/StatsOfbikes";
import MopedIcon from "@mui/icons-material/Moped";
import AddIcon from "@mui/icons-material/Add";
import EnhancedEncryptionIcon from "@mui/icons-material/EnhancedEncryption";
import { API_URL } from "../../config";
import ElectricMopedIcon from "@mui/icons-material/ElectricMoped";
import LoadingAnimation from "../../components/LoadingAnimation";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import MyDatePicker from "../../components/DatePicker";

function BikeUtility() {
  const [bikeData, setBikeData] = useState({ Normal: [], Count: [] });
  const [BikeDetails, setBikeDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [Dataloading, setDataLoading] = useState(false);
  const [hoveredData, setHoveredData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getFormattedToday());

  function getFormattedToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const handleDateChange = (date) => {
    setDataLoading(true);
    setSelectedDate(date);
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
        `http://${API_URL}/Admin/bikeUtility/${selectedDate}/`
      );
      const data = await response.json();
      const sortedData = data.sort((a, b) => b.final_amount - a.final_amount);
      setBikeDetails(sortedData);
      setLoading(false);
      setDataLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
    fetchDetails();
  }, [selectedDate]);

  const totalMinutes = BikeDetails.reduce(
    (sum, item) => sum + item.total_minutes_rented,
    0
  );
  const totalHours =
    BikeDetails.reduce((sum, item) => sum + item.total_hours_rented, 0) +
    Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  const evBikes = BikeDetails.filter((bike) => bike.b_id.startsWith("B"));
const petrolBikes = BikeDetails.filter((bike) => !bike.b_id.startsWith("B"));

  const evTotalMinutes = evBikes.reduce(
    (sum, item) => sum + item.total_minutes_rented,
    0
  );
  const evTotalHours =
    evBikes.reduce((sum, item) => sum + item.total_hours_rented, 0) +
    Math.floor(evTotalMinutes / 60);
  const evRemainingMinutes = evTotalMinutes % 60;

  const petrolTotalMinutes = petrolBikes.reduce(
    (sum, item) => sum + item.total_minutes_rented,
    0
  );
  const petrolTotalHours =
    petrolBikes.reduce((sum, item) => sum + item.total_hours_rented, 0) +
    Math.floor(petrolTotalMinutes / 60);
    
  const petrolRemainingMinutes = petrolTotalMinutes % 60;

  const handleMouseEnter = (data) => {
    setHoveredData(data);
  };

  const handleMouseLeave = () => {
    setHoveredData(null);
  };

  return (
    <div className="bg-white flex flex-col  h-[100%] ">
      {loading ? (
        <LoadingAnimation title="Loading...." />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-center mr-10 ml-8 mt-5">
            <div className="flex flex-row items-center cursor-pointer sm:mt-0  hover:text-yellow-400 hover:underline">
              <h1 className="mt-4 ml-8 text-[#212121] font-bold capitalize">
                Today's Bike Utility
              </h1>
            </div>
            <MyDatePicker onDateChange={handleDateChange} />
          </div>
          <div className="grid grid-cols-2 gap-y-10 sm:gap-x-50  ml-3 xxs:ml-5 mr-6 lg:ml-24  items-center justify-center xxs:w-screen sm:w-full  sm:grid-cols-3  mt-10 ">
            <StatBox
              title="EV Hours"
              value={`${evTotalHours}h ${evRemainingMinutes}m`}
              name="hours"
              icon2={<AccessTimeFilledIcon fontSize="0" />}
            />

            <StatBox
              title="Petrol Hours"
              value={`${petrolTotalHours}h ${petrolRemainingMinutes}m`}
              name="hours"
              icon2={<AccessTimeFilledIcon fontSize="0" />}
            />

            <StatBox
              title="Total Hours"
              name="hours"
              value={`${totalHours}h ${remainingMinutes}m`}
              icon2={<AccessTimeFilledIcon fontSize="0" />}
            />

            <StatBox
              title="EV Killometer"
              value={evBikes.reduce((sum, item) => sum + item.km_for_day, 0)+'  KM'}
            />
             <StatBox
              title="Petrol Killometer"
              name="hours"
              value={petrolBikes.reduce((sum, item) => sum + item.km_for_day, 0)+'  KM'}
             
            />

            <StatBox
              title="Total Amount"
              value={BikeDetails.reduce(
                (sum, item) => sum + item.final_amount,
                0
              )}
              icon2="RS"
            />
          </div>

          <div className="flex-1 container mx-auto p-4">
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
                    <Table className="bg-dimWhite rounded-lg shadow-lg min-w-full">
                      <TableHead>
                        <TableRow>
                          <TableCell className="px-6 py-3 text-left bg-yellow-500 font-bold text-black md:text-lg lg:text-xl xl:text-2xl border-r w-1/6 border-yellow-700">
                            License
                          </TableCell>
                          <TableCell className="px-6 py-3 text-left bg-yellow-500 font-bold text-yellow md:text-lg lg:text-xl xl:text-2xl border-r w-1/6 border-yellow-700">
                            b_id
                          </TableCell>
                          <TableCell className="px-6 py-3 text-left bg-yellow-500 font-bold text-black md:text-lg lg:text-xl xl:text-2xl border-r w-1/6 border-yellow-700">
                            Total Kilometers
                          </TableCell>
                          <TableCell className="px-6 py-3 text-left bg-yellow-500 font-bold text-black md:text-lg lg:text-xl xl:text-2xl border-r w-1/6 border-yellow-700">
                            Total Hourse
                          </TableCell>
                          <TableCell className="px-6 py-3 text-left bg-yellow-500 font-bold text-black md:text-lg lg:text-xl xl:text-2xl border-r w-1/6 border-yellow-700">
                            Total Discounts
                          </TableCell>
                          <TableCell className="px-6 py-3 text-left bg-yellow-500 font-bold text-black md:text-lg lg:text-xl xl:text-2xl border-r w-1/6 border-yellow-700">
                            Total Amount
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {BikeDetails.map((bike, index) => (
                          <TableRow
                            key={bike.b_id}
                            className={`hover:bg-gray-200 ${
                              hoveredData === bike.b_id ? "bg-gray-200" : ""
                            }`}
                          >
                            <TableCell className="px-6 border-r h-20 border-gray py-6">
                              {bike.plate}
                            </TableCell>
                            <TableCell className="px-6 border-r border-gray py-6">
                              <div
                                className="flex items-center"
                                onMouseEnter={() => handleMouseEnter(bike.b_id)}
                                onMouseLeave={handleMouseLeave}
                              >
                                <span className="mr-4 ">{bike.b_id}</span>
                              </div>
                            </TableCell>

                            <TableCell className="px-6 border-r h-20 border-gray py-6">
                              {bike.km_for_day}
                            </TableCell>
                            <TableCell className="px-6 border-r h-20 border-gray py-6">
                              {bike.total_hours_rented} hr :{" "}
                              {bike.total_minutes_rented} min
                            </TableCell>
                            <TableCell className="px-6 border-r h-20 border-gray py-6">
                              RS {bike.discounts}
                            </TableCell>
                            <TableCell className="px-6 border-r h-20 border-gray py-6">
                              RS {bike.final_amount}
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

export default BikeUtility;
