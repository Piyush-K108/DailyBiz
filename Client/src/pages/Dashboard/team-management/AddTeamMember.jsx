import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../config/index";
import axios from "axios";

function AddTeamMember() {
  const [TeamData, setTeamData] = useState({
    name: "",
    phone: "",
    swaf_staff: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeamData({ ...TeamData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setTeamData({ ...TeamData, swap_staff: e.target.checked });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Replace 'YOUR_API_ENDPOINT' with the actual API endpoint
      const response = await axios.post(
        `http://${API_URL}/Team/create_Team/`,
        TeamData
      );

      if (response.status === 200) {
        setIsSuccess(true);
        setIsLoading(false);
        navigate("/TeamInfoData");
      }
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  };

  return (
    // <div
    //   style={{
    //     // Your styles here...
    //     display: "flex",
    //     flexDirection: "column",
    //     width: "calc(100vw - 18vw)",
    //     marginLeft: "18vw",
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
      <div className="h-[100%] w-[400px] sm:w-full  flex flex-col items-center justify-center p-9">
        <div className="flex flex-col items-center shadow m-4 pt-10  h-[450px] sm:rounded-tr-[200px] sm:rounded-bl-[200px] rounded-bl-[100px] rounded-tr-[100px] w-[320px] sm:w-[500px] bg-cover bg-center border-2 border-yellow-400">
          <h1 className="text-black text-sm sm:text-2xl text-center font-bold underline px-2 sm:px-4 py-2 mb-8">
            Add your New Team member *
          </h1>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center items-center"
          >
            <div className="mb-2 flex items-center ">
              {/* <AccountBoxIcon
                fontSize="0"
                className="text-5xl px-1 py-2  text-center items-center  rounded"
              /> */}
              <TextField
                id="bikeId"
                name="name"
                label="Name"
                variant="outlined"
                className="bg-lightgray border-2 border-darkgray rounded-2xl p-2 w-64"
                value={TeamData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-2 flex items-center">
              {/* <ContactPhoneIcon
                fontSize="0"
                className="text-5xl px-1 py-2  text-center items-center  rounded"
              /> */}
              <TextField
                id="phone"
                name="phone"
                label="Phone no."
                variant="outlined"
                className="bg-lightgray border-2 border-darkgray rounded-2xl p-2 w-64"
                value={TeamData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="Condition"
                name="swap_staff"
                checked={TeamData.swap_staff}
                onChange={handleCheckboxChange}
                className="mr-2 checked:bg-yellow-400 checked:border-yellow-400 relative float-left mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-['']  checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-primary checked:after:bg-primary checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-primary checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-primary dark:checked:after:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
              />
              <label className="text-black ml-4 mr-6" htmlFor="Condition">
                Is Swap User
              </label>
            </div>

            {isLoading ? (
              <p>Loading...</p>
            ) : isSuccess ? (
              <p>Form submitted successfully. Redirecting...</p>
            ) : (
              <button
                type="submit"
                className="bg-yellow-400 mt-4 w-[250px] hover:bg-yellow-300 text-black font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:border-blue-300 active-bg-yellow-800"
                style={{ textTransform: "uppercase" }}
              >
                Submit
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddTeamMember;
