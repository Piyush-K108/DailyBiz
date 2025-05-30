import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../config/index";
// import formBg from '../../../assets/bike-form-bg.jpg'
function AddBike() {
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [isSuccess, setIsSuccess] = useState(false);
  const [EV, setEV] = useState(0);
  const navigate = useNavigate();
  const [bikeData, setBikeData] = useState({
    b_id: "",
    license_plate: "",
    KM_Previous: "",
    KM_Now: "",
    Electrical: EV,
  });
  useEffect(() => {
    setBikeData((prevData) => ({
      ...prevData,
      Electrical: EV,
    }));
  }, [EV]);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let inputValue;

    if (type === "checkbox") {
      inputValue = checked;
    } else {
      inputValue = value;
    }

    setBikeData((prevData) => ({
      ...prevData,
      [name]: inputValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Set loading state to true
    setIsLoading(true);
    
    axios
      .post(`http://${API_URL}/Bike/Create/`, bikeData)
      .then((response) => {
        console.log("Data posted successfully:", response.data);

        // After successful submission, set the success state to true
        setIsSuccess(true);

        // Use setTimeout to navigate after a delay (e.g., 2 seconds)
        setTimeout(() => {
          navigate("/Bikes"); // Replace with the desired URL
        }, 2000); // 2000 milliseconds (2 seconds) delay
      })
      .catch((error) => {
        console.error("Error posting data:", error);
      })
      .finally(() => {
        // Set loading state to false in both success and error cases
        setIsLoading(false);
      });
  };
  return (
    // <div
    //   style={{
    //     display: "flex",
    //     flexDirection: "column",
    //     width: "calc(100vw - 18vw)",
    //     marginLeft:"18vw",
    //     height: "100vh",
    //     backgroundColor: "#FFF",
    //     // backgroundColor: "#212121",
    //     overflowY: "scroll",
    //     scrollbarWidth: "none",
    //     "-ms-overflow-style": "none",
    //     "&::-webkit-scrollbar": {
    //       display: "none",
    //     },
    //   }}
    // >

    <div className="bg-white flex flex-col  h-[100%] ">
      <div className="flex flex-col justify-center items-center">
        <div
          className="flex flex-col items-center shadow m-4 pt-10  h-[580px] sm:rounded-tr-[200px] sm:rounded-bl-[200px] rounded-bl-[100px] rounded-tr-[100px] w-[520px] sm:w-[600px] bg-cover bg-center border-8 border-yellow-400"
          // style={{ backgroundImage: `url(${formBg})` }}
        >
          <h1 className="text-black font-bold underline px-4 py-2 mb-8 ">
            Add your New Bike *
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <TextField
                id="licensePlate"
                name="license_plate"
                label="Enter Bike ID"
                variant="outlined"
                className="bg-lightgray border-2 border-black rounded-2xl p-2 w-64"
                value={bikeData.license_plate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-2">
              <TextField
                id="bikeId"
                name="b_id"
                label="Enter License Plate"
                variant="outlined"
                className="bg-lightgray border-2 border-black rounded-2xl p-2 w-64"
                value={bikeData.b_id}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-2">
              <TextField
                id="kmBefore"
                name="KM_Previous"
                label="Enter KM Before"
                variant="outlined"
                className="bg-lightgray border-2 border-black rounded-2xl p-2  w-64"
                value={bikeData.KM_Previous}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-2">
              <TextField
                id="kmNow"
                name="KM_Now"
                label="Enter KM Now"
                variant="outlined"
                className="bg-lightgray border-2 border-black rounded-2xl p-2 w-64"
                value={bikeData.KM_Now}
                onChange={handleChange}
                required
              />
            </div>
            <div class="flex justify-center">
              <div class="mb-[0.125rem] mr-4 inline-block min-h-[1.5rem] pl-[1.5rem]">
                <div class="mb-[0.125rem] mr-4 inline-block min-h-[1.5rem] pl-[1.5rem]">
                  <input
                    checked={EV}
                    onChange={() => setEV(1)}
                    class="checked:checked:bg-yellow-400 checked:checked:border-yellow-400 relative float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-primary checked:after:bg-primary checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-primary checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-primary dark:checked:after:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                    type="radio"
                    name="inlineRadioOptions"
                    id="inlineRadio1"
                    value="option1"
                  />
                  <label
                    class="mt-px inline-block pl-[0.15rem] hover:cursor-pointer"
                    htmlFor="inlineRadio1"
                  >
                    Electric
                  </label>
                </div>
              </div>

              <div class="mb-[0.125rem] mr-4 inline-block min-h-[1.5rem] pl-[1.5rem]">
                <div class="mb-[0.125rem] mr-4 inline-block min-h-[1.5rem] pl-[1.5rem]">
                  <input
                    checked={!EV}
                    onChange={() => setEV(0)}
                    class="checked:checked:bg-yellow-400 checked:checked:border-yellow-400 relative float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-primary checked:after:bg-primary checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-primary checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-primary dark:checked:after:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                    type="radio"
                    name="inlineRadioOptions"
                    id="inlineRadio1"
                    value="option1"
                  />
                  <label
                    class="mt-px inline-block pl-[0.15rem] hover:cursor-pointer"
                    htmlFor="inlineRadio1"
                  >
                    Petrol
                  </label>
                </div>
              </div>
            </div>
            {isLoading ? (
              <p>Loading...</p>
            ) : isSuccess ? (
              <p>Form submitted successfully. Redirecting...</p>
            ) : (
              <button
                type="submit"
                className="bg-yellow-400 mt-4 w-full  hover:bg-yellow-400 text-black py-2 px-4 rounded focus:outline-none focus:ring focus:border-blue-300 active-bg-yellow-800"
              >
                Submit
              </button>
            )}{" "}
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddBike;
