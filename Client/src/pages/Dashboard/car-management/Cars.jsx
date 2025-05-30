import React, { useState, useEffect } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress component
import { API_URL } from "../../../config";
import LoadingAnimation from "../../../components/LoadingAnimation";
const Cars = () => {
  const navigate = useNavigate();

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true); // Initialize loading state

  // Fetch data from the API
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch(`http://${API_URL}/Car/car-info/`);
        const data = await response.json();
        setCars(data);
      } catch (error) {
        console.error("Error fetching car data:", error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchCars();
  }, []);

  return (
    <div className="p-2 bg-white flex items-center justify-center">
      {/* Show loading indicator while fetching */}
      {loading ? (
     
          <LoadingAnimation title="Loading...." />
       
      ) : cars.length > 0 ? (
        <div className="lg:ml-[180px]">
          <div className="flex w-full justify-between my-4">
            <h2 className="sm:text-3xl font-poppins font-bold text-gray-800 mb-4 text-center">
              Car List
            </h2>
            <div className="flex justify-end item-start" title="ADD cars">
              <AddCircleIcon
                className="text-black rounded-full sm:text-5xl text-right text-2xl cursor-pointer"
                fontSize="0"
                onClick={() => {
                  navigate("/AddCars");
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-[50px]">
            {cars.map((car) => (
              <div
                key={car.carid}
                className="bg-white shadow-sm cursor-pointer rounded-lg overflow-hidden transition transform hover:scale-105 w-72"
                onClick={() =>
                  navigate(`/EditCars/${car.carid}`, {
                    state: {
                      image: car.Image,
                    },
                  })
                }
              >
                <img
                  src={car.Image || "https://via.placeholder.com/300x200"}
                  alt={car.modelName}
                  className="w-full h-36 object-cover"
                />
                <div className="p-4">
                  <div className="flex flex-row justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {car.modelName}
                    </h3>
                    <p className="text-gray-800">{car.modelYear}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-gray-100 pl-8 py-2 px-2 rounded-lg">
                    <p className="text-gray-600">Color</p>
                    <p className="text-black">{car.Colour}</p>

                    <p className="text-gray-600">Kilometer</p>
                    <p className=" text-black">{car.KM_Now}</p>

                    <p className="text-gray-600">Fuel</p>
                    <p className="text-black">{car.fuelType}</p>

                    <p className="text-yellow-500">Rate per Hour</p>
                    <p className="text-yellow-500">₹{car.ratePerHour}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No cars available</p>
      )}
    </div>
  );
};

export default Cars;
