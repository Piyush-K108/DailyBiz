import React, { useEffect, useState } from "react";
import "./Bikes.css";
import BikeItem from "../../../components/bike-info-component/BikeItem";
import BikeItem2 from "../../../components/bike-info-component/BikeItem2";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { RecyclingRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../config";
import LoadingAnimation from "../../../components/LoadingAnimation";
const Bikes = ({hasRevenueAccess}) => {
  const [bikeData, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [UI, setUI] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();
  const handleToggleUI = () => {
    setUI(UI === 1 ? 2 : 1);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch(`http://${API_URL}/Admin/bike-data/`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // Sorting the data based on availability first, then license_plate
        const sortedData = responseJson
          .map((item) => {
            // Format license_plate (Adding dash if missing)
            const licensePlate = item.license_plate;
            let transformedLicensePlate;
  
            if (licensePlate.startsWith("A") && !licensePlate.includes("-")) {
              transformedLicensePlate = `A-${licensePlate.substring(1)}`;
            } else if (licensePlate.startsWith("N") && !licensePlate.includes("-")) {
              transformedLicensePlate = `N-${licensePlate.substring(1)}`;
            } else {
              transformedLicensePlate = licensePlate; // Keep unchanged
            }
  
            return {
              ...item,
              license_plate: transformedLicensePlate, // Updated license_plate
            };
          })
          .sort((a, b) => {
            // ✅ Status Sorting: Green (Available) → Red (Assigned) → Orange (Bad Condition)
            const getColorPriority = (bike) => {
              if (!bike.Condition) return 2; // Orange (Bad Condition)
              if (bike.is_assigned) return 1; // Red (Assigned)
              return 0; // Green (Available)
            };
  
            const colorPriorityA = getColorPriority(a);
            const colorPriorityB = getColorPriority(b);
  
            if (colorPriorityA !== colorPriorityB) {
              return colorPriorityA - colorPriorityB;
            }
  
            // ✅ License Plate Sorting: "A" → "N" → "B" → "M"
            const order = ["A", "N", "B", "M","T","7"];
            const aFirstChar = a.license_plate.charAt(0);
            const bFirstChar = b.license_plate.charAt(0);
  
            const aOrder = order.indexOf(aFirstChar);
            const bOrder = order.indexOf(bFirstChar);
  
            if (aOrder !== bOrder) {
              return aOrder - bOrder;
            }
  
            // ✅ Extract numeric parts for numeric sorting (e.g., A-1 before A-10)
            const aNumericPart = parseInt(a.license_plate.split("-")[1] || "0", 10);
            const bNumericPart = parseInt(b.license_plate.split("-")[1] || "0", 10);
  
            return aNumericPart - bNumericPart;
          });
  
        setData(sortedData);
        console.log("Sorted data:", sortedData);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };
  

  const handleDeleteBike = (id) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this bike? The bike id is ${id}`
    );
    if (confirmDelete) {
      setDeleteLoading(true);
      fetch(`http://${API_URL}/Bike/Delete/${id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Error deleting bike: HTTP status ${response.status}`
            );
          }
          // Check if the response has content before trying to parse it as JSON
          if (response.headers.get("content-length") === "0") {
            console.log("Bike deleted successfully");
            return null;
          }
          return response.json();
        })
        .then((data) => {
          if (data) {
            setData(bikeData.filter((bike) => bike.b_id !== id));
            console.log("Bike deleted successfully:", data);
          }

          fetchData();
        })
        .catch((error) => {
          console.error("Error deleting bike:", error);
        })
        .finally(() => {
          setDeleteLoading(false);
        });
    }
  };

  return (
    <div className="bg-white flex flex-col  h-[100%] ">
      {loading ? ( // Display loading animation when loading is true
        <LoadingAnimation title="Loading...." />
      ) : (
        <>
          <div className="flex-1 container mx-auto ">
            <div className="flex w-full justify-between my-4">
              <h1 className="text-2xl sm:text-4xl text-center text-black font-bold  mb-4">
                Bikes
                <RecyclingRounded onClick={handleToggleUI} />
              </h1>

              <div
                className="flex justify-end item-start"
                title="ADD TEAM MEMBER"
              >
                <AddCircleIcon
                  className="text-black  rounded-full sm:text-5xl text-right text-2xl cursor-pointer"
                  fontSize="0"
                  onClick={() => {
                    navigate("/AddBike");
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {UI === 1
                ? bikeData.map((item) => (
                    <BikeItem2
                      item={item}
                      delivery={false}
                      key={item.id}
                      onDelete={handleDeleteBike}
                      hasRevenueAccess = {hasRevenueAccess}
                    />
                  ))
                : bikeData.map((item) => (
                    <BikeItem
                      item={item}
                      delivery={false}
                      key={item.id}
                      onDelete={handleDeleteBike}
                      hasRevenueAccess = {hasRevenueAccess}
                    />
                  ))}
            </div>

            {deleteLoading && (
              // Display delete loading animation while deleteLoading is true
              <div className="text-center mt-4">
                <LoadingAnimation title="Deleting..." />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Bikes;
