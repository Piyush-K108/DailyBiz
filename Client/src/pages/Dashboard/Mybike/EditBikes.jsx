import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import LoadingAnimation from "../../../components/LoadingAnimation";
import { API_URL } from "../../../config";
import UploadModal from "./UploadModal";
import { useNavigate } from "react-router-dom";
import { Upload } from "@mui/icons-material";
const EditBikes = () => {
  const { id } = useParams();
  const [bikeData, setBikeData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    fetch(`http://${API_URL}/Admin/bike-data/?bike_id=${id}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setBikeData(responseJson);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);

  const handleUpdateBike = (updatedBikeData) => {
    console.log(updatedBikeData);
    fetch(`http://${API_URL}/Admin/bike-data/?bike_id=${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
      body: JSON.stringify(updatedBikeData), // Convert the object to JSON
    })
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          // If the response status is not OK, throw an error with the status text

          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((responseJson) => {
        setBikeData(responseJson);
        setLoading(false);
        window.alert("Updated Successfully");
        navigate(-1);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        window.alert("Error: Update not successful");
      });
  };

  const handleUploadDocuments = (formData) => {
    fetch(`http://${API_URL}/Admin/bike-doc/`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        window.alert("Documents uploaded successfully!");
        setModalOpen(false);
      })
      .catch((error) => {
        console.error("Error uploading documents:", error);
        window.alert("Failed to upload documents.");
      });
  };

  return (
    <div className="bg-gray-100 flex flex-col  h-[100%] ">
      {loading ? (
        <LoadingAnimation title="Loading..." />
      ) : (
        <div className="grid grid-cols-2 gap-4 p-8 bg-white sm:w-[700px] shadow-md rounded-lg sm:mt-8 sm:mb-8 mx-auto">
          <div className="col-span-2 flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-poppins">
              Edit Bike - {bikeData.b_id}
            </h2>
            <button
              className="bg-black text-white px-4 py-2 rounded hover:bg-yellow-500"
              onClick={() => setModalOpen(true)}
              title="upload Document"
            >
              {" "}
              <Upload className="font-light cursor-pointer" />
            </button>
          </div>

          <form
            className="col-span-2 grid grid-cols-1 gap-4 justify-center items-center"
            onSubmit={(e) => {
              e.preventDefault();
              const updatedBikeData = {
                b_id: e.target.elements.b_id.value,
                Condition: e.target.elements.Condition.checked,
                Helmet: e.target.elements.Helmet.checked,
                Electrical: e.target.elements.Electrical.value,
                KM_Now: e.target.elements.KM_Now.value,
                license_plate: e.target.elements.license_plate.value,
                Pic_before: e.target.elements.Pic_before.value,
                Estimated_Amount: e.target.elements.Estimated_Amount.value,
                Total_Earned: e.target.elements.Total_Earned.value,
                is_assigned: e.target.elements.is_assigned.checked,
                is_attached: e.target.elements.is_attached.checked,
                // Add other fields as needed
              };
              handleUpdateBike(updatedBikeData);
            }}
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-black" htmlFor="b_id">
                  Bike ID:
                </label>
                <input
                  type="text"
                  id="b_id"
                  name="b_id"
                  defaultValue={bikeData.b_id}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="text-black" htmlFor="Electrical">
                  Electrical:
                </label>
                <input
                  type="text"
                  id="Electrical"
                  name="Electrical"
                  defaultValue={bikeData.Electrical}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="text-black" htmlFor="KM_Now">
                  KM Now:
                </label>
                <input
                  type="text"
                  id="KM_Now"
                  name="KM_Now"
                  defaultValue={bikeData.KM_Now}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="text-black" htmlFor="license_plate">
                  License Plate:
                </label>
                <input
                  type="text"
                  id="license_plate"
                  name="license_plate"
                  defaultValue={bikeData.license_plate}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="text-black" htmlFor="Pic_before">
                  Pic Before:
                </label>
                <input
                  type="text"
                  id="Pic_before"
                  name="Pic_before"
                  defaultValue={bikeData.Pic_before}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="text-black" htmlFor="Estimated_Amount">
                  Estimated Amount:
                </label>
                <input
                  type="text"
                  id="Estimated_Amount"
                  name="Estimated_Amount"
                  defaultValue={bikeData.Estimated_Amount}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="text-black" htmlFor="Total_Earned">
                  Total Earned:
                </label>
                <input
                  type="text"
                  id="Total_Earned"
                  name="Total_Earned"
                  defaultValue={bikeData.Total_Earned}
                  className="w-[80%] p-2 border border-gray-300 rounded"
                />
              </div>
              {/* Add the rest of your input fields here, following the same pattern */}
              <div className="flex flex-col">
                <div className=" flex w-full justify-end items-center mt-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="Condition"
                      name="Condition"
                      defaultChecked={bikeData.Condition}
                      className="mr-2 checked:checked:bg-yellow-400 checked:checked:border-yellow-400 relative float-left mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-primary checked:after:bg-primary checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-primary checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-primary dark:checked:after:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                    />
                    <label className="text-black ml-4 mr-6" htmlFor="Condition">
                      Condition
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="Helmet"
                      name="Helmet"
                      defaultChecked={bikeData.Helmet}
                      className="mr-2 checked:checked:bg-yellow-400 checked:checked:border-yellow-400 relative float-left mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-primary checked:after:bg-primary checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-primary checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-primary dark:checked:after:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                    />
                    <label className="text-black ml-4 mr-6" htmlFor="Helmet">
                      Helmet
                    </label>
                  </div>
                </div>
                <div className=" flex  items-center mt-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_assigned"
                      name="is_assigned"
                      defaultChecked={bikeData.is_assigned}
                      className="mr-2 checked:checked:bg-yellow-400 checked:checked:border-yellow-400 relative float-left mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-primary checked:after:bg-primary checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-primary checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-primary dark:checked:after:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                    />
                    <label
                      className="text-black ml-4 mr-6"
                      htmlFor="is_assigned"
                    >
                      Is Assigned
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_attached"
                      name="is_attached"
                      defaultChecked={bikeData.is_attached}
                      className="mr-2 checked:checked:bg-yellow-400 checked:checked:border-yellow-400 relative float-left mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-primary checked:after:bg-primary checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-primary checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-primary dark:checked:after:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                    />
                    <label
                      className="text-black ml-4 mr-2"
                      htmlFor="is_attached"
                    >
                      Is Attached
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="col-span-2 mt-6 bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-600 font-poppins"
            >
              Update Bike
            </button>
          </form>
          <UploadModal
            bikeId={id}
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            onUpload={handleUploadDocuments}
            car={false}
          />
        </div>
      )}
    </div>
  );
};

export default EditBikes;
