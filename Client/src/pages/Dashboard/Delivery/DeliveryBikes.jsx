import React, { useEffect, useState } from "react";
import "./DeliveryBikes.css";
import BikeItem from "../../../components/bike-info-component/BikeItem";
import BikeItem2 from "../../../components/bike-info-component/BikeItem2";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { RecyclingRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../config";
import LoadingAnimation from "../../../components/LoadingAnimation";
const DeliveryBikes = ({ hasRevenueAccess }) => {
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
    fetch(`http://${API_URL}/Delivery_Bikes/delivery-bikes-list/`, {
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
            } else if (
              licensePlate.startsWith("N") &&
              !licensePlate.includes("-")
            ) {
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

            // ✅ Prioritize AEV over AR
            const getPrefix = (plate) => {
              if (plate.includes("AEV")) return "AEV";
              if (plate.includes("AR")) return "AR";
              return plate; // Default case
            };

            const aPrefix = getPrefix(a.license_plate);
            const bPrefix = getPrefix(b.license_plate);

            if (aPrefix !== bPrefix) {
              return aPrefix.localeCompare(bPrefix); // Ensures AEV comes before AR
            }

            // ✅ Extract numeric parts correctly for sorting
            const extractNumber = (plate) => {
              const match = plate.match(/\d+/); // Extract numeric part
              return match ? parseInt(match[0], 10) : 0; // Convert to integer
            };

            const aNumericPart = extractNumber(a.license_plate);
            const bNumericPart = extractNumber(b.license_plate);

            return aNumericPart - bNumericPart; // Proper numerical sorting
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
                      delivery={true}
                      key={item.license_plate}
                      onDelete={{}}
                      hasRevenueAccess={hasRevenueAccess}
                    />
                  ))
                : bikeData.map((item) => (
                    <BikeItem
                      item={item}
                      delivery={true}
                      key={item.license_plate}
                      onDelete={{}}
                      hasRevenueAccess={hasRevenueAccess}
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

export default DeliveryBikes;
