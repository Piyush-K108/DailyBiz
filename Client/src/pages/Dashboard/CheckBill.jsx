import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../../config";

const CheckBill = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { date, index } = location.state;

  const [Data, setTodayDetails] = useState([]);
  const [index2, setindex2] = useState(index); // Track current index
  const [rentImages, setRentImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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

  // Fetch today's details
  const fetchDetails = async () => {
    try {
      const response = await fetch(
        `http://${API_URL}/Admin/Todays_Revenu_Exel/${date}/`
      );
      const data = await response.json();
      data.sort((a, b) => {
        const timeA = convertTo24Hour(a.Return_date_time);
        const timeB = convertTo24Hour(b.Return_date_time);
        return timeA - timeB;
      });

      setTodayDetails(data);
      console.log(data[18]);

      if (data.length > 0) {
        fetchRentImages(data[index].id); // Fetch images for the first item
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch details.");
    }
  };

  // Fetch rent images based on the Data.id
  const fetchRentImages = async (id) => {
    try {
      const response = await fetch(
        `http://${API_URL}/Admin/rent-images/${id}/`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch rent images.");
      }
      const data = await response.json();
      setRentImages(data);
    } catch (error) {
      console.error("Error fetching rent images:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [date]);

  useEffect(() => {
    if (Data.length > 0 && index2 < Data.length) {
      fetchRentImages(Data[index2].id);
    }
  }, [index2, Data]);

  const handleNext = () => {
    if (index2 < Data.length - 1) {
      setLoading(true);
      setindex2((prevIndex) => prevIndex + 1);
    } else {
      alert("No more data available."); // Alert if already at the last data
    }
  };

  const handlePrevious = () => {
    if (index2 > 0) {
      setLoading(true);
      setindex2((prevIndex) => prevIndex - 1);
    } else {
      alert("No previous data available."); // Alert if already at the first data
    }
  };

  const handleDelete = async () => {
    setShowModal(true);
  };

  const confirmDelete = async () => {
    setShowModal(false);
    setIsDeleting(true);
    try {
      const response = await fetch(
        `http://${API_URL}/Admin/rent-images/${Data[index2].id}/`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("Image deleted successfully");
        navigate(-1); // Navigate back after successful deletion
      } else {
        const result = await response.json();
        alert(`Error: ${result.Error}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="bg-white text-black flex items-center justify-center font-bold md:  h-auto p-4">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white text-black flex items-center justify-center font-bold md:  h-auto p-4">
        Already Checked and deleted
      </div>
    );
  }

  if (rentImages.length === 0) {
    return (
      <div className="bg-white text-black flex items-center justify-center font-bold md:  h-auto p-4">
        No images available
      </div>
    );
  }

  const { bikeImage, KM_Before, KM_After, bike } = rentImages[0];

  return (
    <div className="bg-white text-black flex flex-col w-full md:  h-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Check Bill Details - {bike}</h1>

      <div className="flex flex-col items-center mb-4">
        <div className="bg-gray-100 p-4 rounded-lg shadow-md w-full flex flex-row justify-between">
          <div className="flex flex-col items-center flex-1 mx-2">
            <a href={bikeImage} target="_blank" rel="noopener noreferrer">
              <img
                src={bikeImage}
                alt="Bike Image"
                className="w-[40%] object-cover rounded-md"
              />
            </a>
          </div>
          <div className="flex flex-col items-start flex-1 mx-2">
            <a href={KM_Before} target="_blank" rel="noopener noreferrer">
              <img
                src={KM_Before}
                alt="KM Before"
                className="w-[40%] object-cover rounded-md"
              />
            </a>
            <div className="mt-2 ">
              <span className="font-semibold">KM Went:</span>
              <span className="ml-2">{Data[index2].KM_Went}</span>
            </div>
          </div>

          <div className="flex flex-col items-start flex-1 mx-2">
            <a href={KM_After} target="_blank" rel="noopener noreferrer">
              <img
                src={KM_After}
                alt="KM After"
                className="w-[40%] object-cover rounded-md"
              />
            </a>
            <div className="mt-2 ">
              <span className="font-semibold">KM Now:</span>
              <span className="ml-2">
                {parseInt(Data[index2].KM_For) + parseInt(Data[index2].KM_Went)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-5 mt-4">
        <button
          onClick={handlePrevious}
          className="bg-gray-300 text-black font-medium py-2 px-4 rounded hover:bg-gray-400 flex items-center"
        >
          <i className="fas fa-chevron-left mr-2"></i>
          Previous
        </button>

        <div className="flex space-x-4">
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white font-medium py-2 px-4 rounded hover:bg-red-600"
          >
            Delete
          </button>

          <button
            onClick={() => navigate(-1)}
            className="bg-yellow-400 text-black font-medium py-2 px-4 rounded hover:bg-yellow-500"
          >
            Back
          </button>
        </div>

        <button
          onClick={handleNext}
          className="bg-blue-500 text-white font-medium py-2 px-4 rounded hover:bg-blue-600 flex items-center"
        >
          Next
          <i className="fas fa-chevron-right ml-2"></i>
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete this image?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className="bg-gray-300 text-black font-medium py-2 px-4 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className={`bg-red-500 text-white font-medium py-2 px-4 rounded hover:bg-red-600 ${
                  isDeleting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "OK"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckBill;
