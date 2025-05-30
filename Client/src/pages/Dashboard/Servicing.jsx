import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import CustomModal from "../../components/Modal/CustomModal"; // Import the custom modal
import { FaLink } from "react-icons/fa";
import { API_URL } from "../../config";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";

const Servicing = () => {
  const [dataLoading, setDataLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const hoveredData = null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://${API_URL}/Bike/servicing/`);
        const result = await response.json();
        setServices(result.services);
        setDataLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setDataLoading(false);
      }
    };

    fetchData();
  }, []);

  const openModal = (index, services) => {
    setSelectedService(services[index]);
    setModalOpen(true);
  };

  const closeModal = () => {
    setCurrentIndex(0);
    setModalOpen(false);
    setSelectedService(null);
  };

  const fetchBikeService = async (b_id, index) => {
    try {
      setModalLoading(true);
      const response = await fetch(
        `http://${API_URL}/Bike/servicing_bid/${b_id}/${index}/`
      );
      const result = await response.json();
      setModalLoading(false);
      if (result.service) {
        openModal(currentIndex, [result.service]);
      } else {
        setModalOpen(false);
        setCurrentIndex(0);
      }
    } catch (error) {
      console.error("Error fetching bike services:", error);

      setModalLoading(false);
    }
  };

  const fetchBikeServices = async (b_id, index) => {
    fetchBikeService(b_id, index);
  };

  const handlePrevious = (bid) => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : 0;
    setCurrentIndex(newIndex);
    fetchBikeService(bid, newIndex);
  };

  const handleNext = (bid) => {
    const newIndex = currentIndex < 0 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    console.log(newIndex);
    fetchBikeService(bid, newIndex);
  };

  const formatDatePlusTwoMonths = (dateString) => {
    const originalDate = new Date(dateString);
    const newDate = new Date(originalDate);
    newDate.setMonth(newDate.getMonth() + 2);

    if (newDate.getMonth() < originalDate.getMonth()) {
      newDate.setFullYear(newDate.getFullYear() + 1);
    }

    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, "0");
    const day = String(newDate.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="bg-white flex flex-col  h-[100%] ">
      <div className="flex-1 container mx-auto p-4">
        <h1 className="mt-4 text-[#212121] font-bold capitalize">Servicing</h1>

        {dataLoading ? (
          <div className="p-2 mt-8 ml-8 mr-8 mb-8 rounded-lg shadow-lg">
            <div className="flex justify-center items-center flex-row gap-3">
              <div className="w-4 h-4 rounded-full bg-yellow-400 animate-bounce"></div>
              <div className="w-4 h-4 rounded-full bg-yellow-400 animate-bounce [animation-delay:-.3s]"></div>
              <div className="w-4 h-4 rounded-full bg-yellow-400 animate-bounce [animation-delay:-.3s]"></div>
              <div className="w-4 h-4 rounded-full bg-yellow-400 animate-bounce [animation-delay:-.5s]"></div>
            </div>
          </div>
        ) : (
          <div className="shadow-md rounded my-6 overflow-x-auto">
            <TableContainer component={Paper}>
              <Table className="bg-dimWhite cursor-pointer rounded-lg shadow-lg min-w-full">
                <TableHead>
                  <TableRow>
                    <TableCell className="px-6 py-3 text-left bg-yellow-500 font-bold text-black md:text-lg lg:text-xl xl:text-2xl border-r w-1/10 border-yellow-700">
                      S.NO.
                    </TableCell>
                    <TableCell className="px-6 py-3 text-left bg-yellow-500 font-bold text-black md:text-lg lg:text-xl xl:text-2xl border-r w-1/6 border-yellow-700">
                      License
                    </TableCell>
                    <TableCell className="px-6 py-3 text-left bg-yellow-500 font-bold text-yellow md:text-lg lg:text-xl xl:text-2xl border-r w-1/6 border-yellow-700">
                      Last_Service_Date
                    </TableCell>
                    <TableCell className="px-6 py-3 text-left bg-yellow-500 font-bold text-black md:text-lg lg:text-xl xl:text-2xl border-r w-[12.5%] border-yellow-700">
                      Last Service KM
                    </TableCell>
                    <TableCell className="px-6 py-3 text-left bg-yellow-500 font-bold text-black md:text-lg lg:text-xl xl:text-2xl border-r w-1/6 border-yellow-700">
                      Next Service Date
                    </TableCell>
                    <TableCell className="px-6 py-3 text-left bg-yellow-500 font-bold text-black md:text-lg lg:text-xl xl:text-2xl border-r w-[12.5%] border-yellow-700">
                      Next Service KM
                    </TableCell>
                    <TableCell className="px-6 py-3 text-left bg-yellow-500 font-bold text-black md:text-lg lg:text-xl xl:text-2xl border-r w-[10.5%] border-yellow-700">
                      Amount Paid
                    </TableCell>
                    <TableCell className="px-6 py-3 text-left bg-yellow-500 font-bold text-black md:text-lg lg:text-xl xl:text-2xl border-r border-yellow-700">
                      Bill
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {services.map((service, index) => (
                    <TableRow
                      key={service.id}
                      onDoubleClick={() => {
                        console.log(currentIndex);
                        setCurrentIndex(0);
                        fetchBikeServices(service.bike.b_id, index);
                      }}
                      className={`hover:bg-gray-200 `}
                    >
                      <TableCell className="px-6 border-r h-20 border-gray py-6">
                        {service.id}
                      </TableCell>
                      <TableCell className="px-6 py-3 text-left border-r border-yellow-700">
                        {service.bike.license_plate}
                      </TableCell>
                      <TableCell className="px-6 py-3 text-left border-r border-yellow-700">
                        {service.Date}
                      </TableCell>
                      <TableCell className="px-6 py-3 text-left border-r border-yellow-700">
                        {service.KM}
                      </TableCell>
                      <TableCell className="px-6 py-3 text-left border-r border-yellow-700">
                        {formatDatePlusTwoMonths(service.Date)}
                      </TableCell>
                      <TableCell className="px-6 py-3 text-left border-r border-yellow-700">
                        {service.KM + 2000}
                      </TableCell>
                      <TableCell className="px-6 py-3 text-left border-r border-yellow-700">
                        {service.Payed}
                      </TableCell>
                      <TableCell className="px-6 py-3 text-left border-r border-yellow-700">
                        <a
                          href={service.Bill}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaLink />
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
      </div>
      <CustomModal isOpen={modalOpen} onClose={closeModal}>
        {modalLoading ? (
          <div className="flex justify-center items-center">
            <div className="w-4 h-4 rounded-full bg-yellow-400 animate-bounce"></div>
            <div className="w-4 h-4 rounded-full bg-yellow-400 animate-bounce [animation-delay:-.3s]"></div>
            <div className="w-4 h-4 rounded-full bg-yellow-400 animate-bounce [animation-delay:-.3s]"></div>
            <div className="w-4 h-4 rounded-full bg-yellow-400 animate-bounce [animation-delay:-.5s]"></div>
          </div>
        ) : (
          selectedService && (
            <div className="flex flex-col gap-1">
              <h2 className="font-bold underline text-yellow-600 mb-4">
                Service Details
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <p>
                  Bike ID:
                  <span className="ml-2 font-medium">
                    {selectedService.bike.b_id}
                  </span>
                </p>
                <p>
                  License Plate:
                  <span className="ml-2 font-medium">
                    {selectedService.bike.license_plate}
                  </span>
                </p>
                <p>
                  Date:
                  <span className="ml-2 font-medium">
                    {selectedService.Date}
                  </span>{" "}
                </p>
                <p>
                  Kilometers:
                  <span className="ml-2 font-medium">{selectedService.KM}</span>
                </p>
                <p>
                  Paid:
                  <span className="ml-2 font-medium">
                    ₹{selectedService.Payed}
                  </span>
                </p>
                <p>
                  Mode:
                  <span className="ml-2 font-medium">
                    {selectedService.Mode}
                  </span>
                </p>
                <p className="bg-yellow-100 w-24 px-2 py-1 text-black font-medium rounded text-[13px] shadow ">
                  <a
                    href={selectedService.Bill}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="flex flex-row gap-2">
                      View Bill
                      <RocketLaunchOutlinedIcon
                        fontSize="0"
                        className="text-[17px]"
                      />
                    </div>
                  </a>
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "20px",
                }}
              >
                <IconButton
                  className="border shadow bg-yellow-400"
                  onClick={() => handlePrevious(selectedService.bike.b_id)}
                >
                  <ArrowBack className="" />
                </IconButton>
                <IconButton
                  onClick={() => handleNext(selectedService.bike.b_id)}
                  className="border shadow"
                >
                  <ArrowForward />
                </IconButton>
              </div>
            </div>
          )
        )}
      </CustomModal>
    </div>
  );
};

export default Servicing;
