import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import { API_URL } from "../../../config";
import { useNavigate } from "react-router-dom";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditNoteSharp from "@mui/icons-material/EditNoteSharp";

function TeamInfoData() {
  const [teamData, setTeamData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [Bills, setBills] = useState([]);
  const [deletePhone, setDeletePhone] = useState(null);
  const [Persnal, setPersnal] = useState([]);
  const [hoveredData, setHoveredData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 8;
  const totalPages = Math.ceil(teamData.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = teamData.slice(
    indexOfFirstRecord,
    indexOfLastRecord > teamData.length ? undefined : indexOfLastRecord
  );
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeamData();
    fetchBillData();
    fetchPersnalData();
  }, []);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const fetchTeamData = () => {
    fetch(`http://${API_URL}/Admin/staff-data/`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setTeamData(responseJson);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleDeleteConfirm = async () => {
    if (!deletePhone) return;
    try {
      const response = await fetch(
        `http://${API_URL}/Admin/staff-data/?phone=${deletePhone}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to delete staff member");

      setTeamData((prev) => prev.filter((s) => s.phone !== deletePhone));
    } catch (error) {
      console.error("Error deleting staff:", error);
    }
    setDeletePhone(null);
  };
  const fetchBillData = () => {
    fetch(`http://${API_URL}/Admin/WrongBill/`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setBills(responseJson);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const fetchPersnalData = () => {
    fetch(`http://${API_URL}/Admin/PersnalUse/`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setPersnal(responseJson);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleMouseEnter = (data) => {
    setHoveredData(data);
  };

  const handleMouseLeave = () => {
    setHoveredData(null);
  };

  return (
    <>
      <div className="bg-white flex flex-col  h-[100%] ">
        <div className="container p-4">
         <div className="flex w-full justify-between my-4">
            <h1 className="text-1xl sm:text-2xl text-center text-black font-bold  mb-4">
              Team Management
            </h1>
            <div
              className="flex justify-end item-start"
              title="ADD TEAM MEMBER"
            >
              <AddCircleIcon
                className="text-black  rounded-full sm:text-5xl text-right text-2xl cursor-pointer"
                fontSize="0"
                onClick={() => {
                  navigate("/AddTeamMember");
                }}
              />
            </div>
          </div>

          {loading ? (
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
              <TableContainer component={Paper} className="shadow-md rounded">
                <Table>
                  <TableHead>
                    <TableRow className="bg-yellow-500">
                      {["Name", "Contact", "Password", "City"].map((header) => (
                        <TableCell key={header} className="font-bold">
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentRecords.map((member) => (
                      <TableRow key={member.id} className="hover:bg-gray-200">
                        <TableCell
                          className="flex items-center space-x-4"
                          onMouseEnter={() => setHoveredData(member.phone)}
                          onMouseLeave={() => setHoveredData(null)}
                        >
                          <span>{member.name}</span>
                          {hoveredData === member.phone && (
                            <>
                              <EditNoteSharp
                                className="text-blue-400 cursor-pointer"
                                onClick={() =>
                                  navigate("/EditTeamMember", {
                                    state: { phone: member.phone },
                                  })
                                }
                              />
                              <DeleteForeverIcon
                                className="text-red-400 cursor-pointer"
                                onClick={() => setDeletePhone(member.phone)}
                              />
                            </>
                          )}
                        </TableCell>
                        <TableCell>{member.phone}</TableCell>
                        <TableCell>
                          {member.password.length > 7
                            ? "******"
                            : member.password}
                        </TableCell>
                        <TableCell>{member.City}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
          <div className="mt-4 flex justify-between">
            <button
              className="p-2 bg-gray-200 rounded disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeftIcon />
            </button>
            <p>
              Page {currentPage} of {totalPages}
            </p>
            <button
              className="p-2 bg-gray-200 rounded disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>
        <Dialog open={!!deletePhone} onClose={() => setDeletePhone(null)}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this staff member?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeletePhone(null)}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <div className="flex-1 container mx-auto p-4">
          <h1 className="text-1xl sm:text-2xl text-start text-black font-bold  mb-4">
            Wrong Bills
          </h1>
          {loading ? (
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
                          Bike_ID
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
                          Customer_Name
                        </TableCell>
                        <TableCell className="px-6 py-3 text-left bg-yellow-500 font-bold text-black md:text-lg w-1/6 lg:text-xl xl:text-2xl">
                          Contact
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Bills.map((bike, index) => (
                        <TableRow
                          key={bike.id}
                          className={`hover:bg-gray-200 ${
                            hoveredData === bike.bike_id ? "bg-gray-200" : ""
                          }`}
                        >
                          <TableCell className="px-6 border-r h-20 border-gray py-6">
                            {bike.Plate}
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
                            {bike.rental_date}
                          </TableCell>
                          <TableCell className="px-6 border-r h-20 border-gray py-6">
                            {bike.return_date}
                          </TableCell>

                          <TableCell className="px-6 border-r h-20 border-gray py-6">
                            {bike.rental_time}
                          </TableCell>
                          <TableCell className="px-6 border-r h-20 border-gray py-6">
                            {bike.return_time}
                          </TableCell>

                          <TableCell className="px-6 border-r h-20 border-gray py-6">
                            {bike.user_name}
                          </TableCell>

                          <TableCell className="px-6 border-r h-20 border-gray py-6">
                            {bike.user_phone}
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

        <div className="flex-1 container mx-auto p-4">
          <h1 className="text-1xl sm:text-2xl text-start text-black font-bold  mb-4">
            Persnal Use
          </h1>
          {loading ? (
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
                          Bike_ID
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
                          KM_For
                        </TableCell>

                        <TableCell className="px-6 py-3 text-left bg-yellow-500 font-bold text-black md:text-lg lg:text-xl xl:text-2xl border-r w-1/6 border-yellow-700">
                          Customer_Name
                        </TableCell>
                        <TableCell className="px-6 py-3 text-left bg-yellow-500 font-bold text-black md:text-lg w-1/6 lg:text-xl xl:text-2xl">
                          Contact
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Persnal.map((bike, index) => (
                        <TableRow
                          key={bike.id}
                          className={`hover:bg-gray-200 ${
                            hoveredData === bike.bike_id ? "bg-gray-200" : ""
                          }`}
                        >
                          <TableCell className="px-6 border-r h-20 border-gray py-6">
                            {bike.Plate}
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
                            {bike.rental_date}
                          </TableCell>
                          <TableCell className="px-6 border-r h-20 border-gray py-6">
                            {bike.return_date}
                          </TableCell>

                          <TableCell className="px-6 border-r h-20 border-gray py-6">
                            {bike.rental_time}
                          </TableCell>
                          <TableCell className="px-6 border-r h-20 border-gray py-6">
                            {bike.return_time}
                          </TableCell>
                          <TableCell className="px-6 border-r h-20 border-gray py-6">
                            {bike.for}
                          </TableCell>
                          <TableCell className="px-6 border-r h-20 border-gray py-6">
                            {bike.user_name}
                          </TableCell>

                          <TableCell className="px-6 border-r h-20 border-gray py-6">
                            {bike.user_phone}
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
      </div>
    </>
  );
}

export default TeamInfoData;
