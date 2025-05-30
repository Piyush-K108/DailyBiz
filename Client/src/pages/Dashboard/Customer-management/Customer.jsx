import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { API_URL } from "../../../config";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import LoadingAnimation from "../../../components/LoadingAnimation";

function Customer() {
  const [teamData, setTeamData] = useState([]);
  const [UserData, setUserData] = useState([]);
  const [hoveredData, setHoveredData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 6;
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeamData();
    fetchTeamData2();
  }, []);

  const fetchTeamData = () => {
    fetch(`http://${API_URL}/Admin/user-data/`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setTeamData(responseJson);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const fetchTeamData2 = () => {
    fetch(`http://${API_URL}/Admin/Active_User/`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setUserData(responseJson);
        console.log("active", responseJson);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleMouseEnter = (data) => {
    setHoveredData(data);
  };

  const handleMouseLeave = () => {
    setHoveredData(null);
  };

  const handleEdit = (uid) => {
    console.log(`Edited data with ID: ${uid}`);
  };

  // Sorting the data before pagination
  const sortedTeamData = [...teamData].sort((a, b) => {
    const aActive = UserData.find((user) => user.uid === a.uid)?.Active;
    const bActive = UserData.find((user) => user.uid === b.uid)?.Active;

    // Sort by active status first
    const statusComparison = (bActive === 1 ? 1 : 0) - (aActive === 1 ? 1 : 0);

    // If both statuses are the same, sort by rental_date
    if (statusComparison === 0) {
      const aRentalDate =
        UserData.find((user) => user.uid === a.uid)?.rental_date || "";
      const bRentalDate =
        UserData.find((user) => user.uid === b.uid)?.rental_date || "";

      return (
        convertDateToNumber(bRentalDate) - convertDateToNumber(aRentalDate)
      );
    }
    return statusComparison;
  });

  // Paginate after sorting
  const totalPages = Math.ceil(sortedTeamData.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sortedTeamData.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  function convertHoursToDaysHours(totalHours) {
    const days = Math.floor(totalHours / 24); // Calculate full days
    const hours = totalHours % 24; // Calculate remaining hours
  
    // Build the result dynamically based on non-zero values
    const parts = [];
    if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
    if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
    
    // Join the parts with a comma, or return "No time" if both are zero
    return parts.length > 0 ? parts.join(', ') : 'No time';
  }
  

  return (
    <div className="bg-white flex flex-col  h-[100%] ">
      {loading ? (
        <LoadingAnimation title="Loading..." />
      ) : (
        <div className="flex-1 container mx-auto p-4">
          <h1 className="text-1xl sm:text-2xl text-center text-black font-bold mb-4">
            Customer Management
          </h1>

          <div className="bg-white shadow-md rounded my-6 overflow-x-auto">
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="px-2 py-1 sm:py-3 text-left bg-yellow-500 text-yellow w-1/2 sm:w-1/6">
                      S.NO
                    </TableCell>
                    <TableCell className="px-2 py-1 sm:py-3 text-left bg-yellow-500 text-yellow w-1/2 sm:w-1/6">
                      Name
                    </TableCell>
                    <TableCell className="px-3 py-1 sm:py-3 text-left bg-yellow-500 text-yellow w-1/2 sm:w-1/6">
                      Contact Number
                    </TableCell>
                    <TableCell className="px-3 py-1 sm:py-3 text-left bg-yellow-500 text-yellow w-1/2 sm:w-1/6">
                      City
                    </TableCell>
                    <TableCell className="px-3 py-1 sm:py-3 text-left bg-yellow-500 text-yellow w-1/2 sm:w-1/6">
                      Date of Birth
                    </TableCell>
                    <TableCell className="px-2 py-1 sm:py-3 text-left bg-yellow-500 text-yellow w-1/2 sm:w-1/6">
                      Rental_Date
                    </TableCell>
                    <TableCell className="px-2 py-1 sm:py-3 text-left bg-yellow-500 text-yellow w-1/2 sm:w-1/6">
                      Rental_Time
                    </TableCell>
                    <TableCell className="px-2 py-1 sm:py-3 text-left bg-yellow-500 text-yellow w-1/2 sm:w-1/6">
                      Return_Time
                    </TableCell>
                    <TableCell className="px-2 py-1 sm:py-3 text-left bg-yellow-500 text-yellow w-1/2 sm:w-1/6">
                      User Count
                    </TableCell>
                    <TableCell className="px-2 py-1 sm:py-3 text-left bg-yellow-500 text-yellow w-1/2 sm:w-1/6">
                      Amount Spend
                    </TableCell>
                    <TableCell className="px-2 py-1 sm:py-3 text-left bg-yellow-500 text-yellow w-1/2 sm:w-1/6">
                      Advance
                    </TableCell>
                    <TableCell className="px-3 py-2 sm:py-3 text-left bg-yellow-500 text-yellow w-1/2 sm:w-1/6">
                      Deposit_______
                    </TableCell>
                    <TableCell className="px-3 py-2 sm:py-3 text-left bg-yellow-500 text-yellow w-1/2 sm:w-1/6">
                      Bike
                    </TableCell>
                    <TableCell className="px-3 py-2 sm:py-3 text-left bg-yellow-500 text-yellow w-1/2 sm:w-1/6">
                      Payed
                    </TableCell>
                    <TableCell className="px-3 py-2 sm:py-3 text-left bg-yellow-500 text-yellow w-1/2 sm:w-1/6">
                      Rented By
                    </TableCell>
                    <TableCell className="px-3 py-2 sm:py-3 text-left bg-yellow-500 text-yellow w-1/2 sm:w-1/6">
                      Deposited By
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {currentRecords.map((member, index) => {
                    const correspondingUserData = UserData.find(
                      (user) => user.uid === member.uid
                    );
                    return (
                      <TableRow
                        key={member.id}
                        onDoubleClick={() =>
                          navigate(`/Customer/${member.phone}/`, {
                            state: {
                              Data: member,
                              Amount: correspondingUserData?.Amount,
                              r_id: correspondingUserData?.r_id,
                            },
                          })
                        }
                        className={`hover:bg-gray-200 ${
                          hoveredData === member.name ? "bg-gray-200" : ""
                        }`}
                      >
                        <TableCell className="px-3 py-2 sm:py-4 border-r h-20 border-gray">
                          {correspondingUserData?.r_id}
                        </TableCell>
                        <TableCell className="px-3 border-r border-gray py-2 sm:py-4">
                          <div
                            className="flex items-center"
                            onMouseEnter={() => handleMouseEnter(member.name)}
                            onMouseLeave={handleMouseLeave}
                          >
                            <span>{member.name}</span>
                            {hoveredData === member.name && (
                              <EditIcon
                                className="text-blue-400 cursor-pointer"
                                fontSize="medium"
                                onClick={() => handleEdit(member.uid)}
                              />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="px-3 py-2 sm:py-4 border-r h-20 border-gray">
                          {member.phone}
                        </TableCell>
                        <TableCell className="px-3 py-2 sm:py-4 border-r h-20 border-gray">
                          {member.City}
                        </TableCell>
                        <TableCell className="px-3 py-2 sm:py-4 border-r h-20 border-gray">
                          {member.Date_of_Birth}
                        </TableCell>
                        <TableCell
                          sx={{ width: "auto", overflowX: "auto" }}
                          className="px-3 py-2 sm:py-4 border-r h-20 border-gray whitespace-nowrap"
                        >
                          {correspondingUserData
                            ? formatDate(correspondingUserData.rental_date)
                            : null}
                        </TableCell>
                        <TableCell className="px-3 py-2 sm:py-4 border-r h-20 border-gray">
                          {correspondingUserData?.rental_time}
                        </TableCell>
                        <TableCell className="px-3 py-2 sm:py-4 border-r h-20 border-gray">
                          {correspondingUserData?.TimeThought
                            ? convertHoursToDaysHours(
                                correspondingUserData.TimeThought
                              )
                            : "No data available"}
                        </TableCell>
                        <TableCell className="px-3 py-2 sm:py-4 border-r h-20 border-gray">
                          {correspondingUserData?.Count}
                        </TableCell>
                        <TableCell className="px-3 py-2 sm:py-4 border-r h-20 border-gray">
                          {correspondingUserData?.Amount}
                        </TableCell>
                        <TableCell className="px-3 py-2 sm:py-4 border-r h-20 border-gray">
                          {correspondingUserData?.Advance}
                        </TableCell>
                        <TableCell className="px-3 py-2 sm:py-4 border-r h-20 border-gray">
                          {correspondingUserData?.deposite}
                        </TableCell>
                        <TableCell className="px-3 py-2 sm:py-4 border-r h-20 border-gray">
                          {member.bike_ids}
                        </TableCell>
                        <TableCell className="px-3 py-2 sm:py-4 border-r h-20 border-gray">
                          {correspondingUserData?.payed}
                        </TableCell>
                        <TableCell className="px-3 py-2 sm:py-4 border-r h-20 border-gray">
                          {correspondingUserData?.Staff_rent}
                        </TableCell>
                        <TableCell className="px-3 py-2 sm:py-4 border-r h-20 border-gray">
                          {correspondingUserData?.Staff_deposite}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          <div className="mt-auto flex justify-start space-x-2">
            <button
              className="pagination-btn w-8 h-8"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeftIcon className="cursor-pointer" fontSize="medium" />
            </button>
            <button
              className="pagination-btn w-8 h-8"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRightIcon className="cursor-pointer" fontSize="medium" />
            </button>
          </div>
          <p className="mt-auto flex justify-start text-black">
            Page {currentPage} of {totalPages}
          </p>
        </div>
      )}
    </div>
  );
}

export default Customer;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();

  return `${day}-${month}-${year}`;
};

const convertDateToNumber = (dateString) => {
  const date = new Date(dateString);
  return date.getTime();
};
