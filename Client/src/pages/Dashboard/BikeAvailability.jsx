import React, { useState, useEffect } from "react";
import BikeInfoCard from "../../components/bike-info-component/BikeinfoCard";
import StatBox from "../../components/bike-info-component/StatsOfbikes";
import Header from "../../components/Shared/Header";
import MopedIcon from "@mui/icons-material/Moped";
import AddIcon from "@mui/icons-material/Add";

import EnhancedEncryptionIcon from "@mui/icons-material/EnhancedEncryption";
import LoadingAnimation from "../../components/Animations/LoadingAnimation";
import { API_URL } from "../../config";
import ElectricMopedIcon from "@mui/icons-material/ElectricMoped";
function BikeAvailability() {
  const [bikeData, setBikeData] = useState({ Normal: [], Count: [] });

  const [loading, setLoading] = useState(true);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (!fetched) {
      fetchData();

      setFetched(true);
    }
  }, [fetched]);

  const fetchData = async () => {
    try {
      const response = await fetch(`http://${API_URL}/Admin/Bike_Data/`);
      const data = await response.json();
      setBikeData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "calc(100vw - 18vw)",
        marginLeft:"18vw",
        height: "100vh",
        backgroundColor: "#212121",
        overflowY: "scroll",
        scrollbarWidth: "none",
        "-ms-overflow-style": "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >

      {loading ? ( // Conditional rendering based on loading state
        <div className="flex  justify-center items-center h-[100%]">
          <LoadingAnimation title="Loading...." />
          <div className="flex item-center">
            {/* <p className="text-white  ">Loading...</p> */}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2 items-center sm:grid-cols-4 gap-6 mt-20 ml-8">
            <StatBox
              title="Total Bikes"
              value={bikeData.Normal.length}
              icon2={<AddIcon fontSize="0" />}
            />
            <StatBox
              title="EV Bikes on Rent"
              value={
                bikeData.Normal.filter(
                  (bike) => bike.is_assigned && bike.Electrical
                ).length
              }
              icon2={<ElectricMopedIcon fontSize="0" />}
            />
            <StatBox
              title="Petrol Bikes on Rent"
              value={
                bikeData.Normal.filter(
                  (bike) => bike.is_assigned && !bike.Electrical
                ).length
              }
              icon2={<MopedIcon fontSize="0" />}
            />
            <StatBox
              title="Total Bikes on Rent"
              value={bikeData.Normal.filter((bike) => bike.is_assigned).length}
              icon2={<EnhancedEncryptionIcon fontSize="0" />}
            />
          </div>

          <h1 className="mt-4 ml-8 text-white font-bold capitalize">
            Our Bikes
          </h1>

          <div className="bg-white p-2 mt-8 ml-8 mr-8 mb-8 rounded-lg shadow-lg ">
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {/* Bike ID */}
              <div className="border-r md:border-r-0 lg:border-r border-gray-300  h-350px">
                <BikeInfoCard
                  title="Bike ID"
                  data={bikeData.Normal.filter((bike) => !bike.is_attached).map(
                    (item) => item.b_id
                  )}
                />
              </div>

              {/* Current KM Reading */}
              <div className="border-r md:border-r-0 lg:border-r border-gray-300">
                <BikeInfoCard
                  title="Current KM Reading"
                  data={bikeData.Normal.filter((bike) => !bike.is_attached).map(
                    (item) => item.KM_Now
                  )}
                />
              </div>

              {/* Today's Bike Rent Count */}
              <div className="border-r md:border-r-0 lg:border-r border-gray-300">
                <BikeInfoCard
                  title="Today's Rent Count"
                  data={bikeData.Normal.filter((bike) => !bike.is_attached).map(
                    (bike) => {
                      const bikeCount = bikeData.Count.find(
                        (count) => count.Bike_id === bike.b_id
                      );
                      return bikeCount ? bikeCount.Count : 0;
                    }
                  )}
                />
              </div>
              <div className="border-r md:border-r-0 lg:border-r border-gray-300">
                <BikeInfoCard
                  title="Total Revenue"
                  data={bikeData.Normal.filter((bike) => !bike.is_attached).map(
                    (item) => item.Total_Earned
                  )}
                />
              </div>
            </div>
          </div>

          <h1 className="text-white ml-8 font-bold capitalize">
            Attached Bikes
          </h1>

          <div className="bg-white p-2 mt-8 mb-8 ml-8 mr-8 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Bike ID */}
              <div className="border-r border-gray-300">
                <BikeInfoCard
                  title="Bike ID"
                  data={bikeData.Normal.filter((bike) => bike.is_attached).map(
                    (item) => item.b_id
                  )}
                />
              </div>

              {/* Owner */}
              <div className="border-r border-gray-300">
                <BikeInfoCard
                  title="Owner"
                  data={bikeData.Normal.filter((bike) => bike.is_attached).map(
                    (item) => item.KM_Now
                  )}
                />
              </div>

              {/* Owner Contact */}
              <div className="border-r border-gray-300">
                <BikeInfoCard
                  title="Owner Contact"
                  data={bikeData.Normal.filter((bike) => bike.is_attached).map(
                    (item) => item.KM_Now
                  )}
                />
              </div>

              {/* Bike Reading */}
              <div className="border-r border-gray-300">
                <BikeInfoCard
                  title="Bike Reading"
                  data={bikeData.Normal.filter((bike) => bike.is_attached).map(
                    (item) => item.KM_Now
                  )}
                />
              </div>

              {/* Total Revenue */}
              <div className="border-r border-gray-300">
                <BikeInfoCard
                  title="Total Revenue"
                  data={bikeData.Normal.filter((bike) => bike.is_attached).map(
                    (item) => item.Total_Earned
                  )}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default BikeAvailability;
