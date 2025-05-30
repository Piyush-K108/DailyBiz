//
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { API_URL } from "../../../config";
import { FaCheckCircle } from "react-icons/fa";
import emergencyIcon from "../../../assets/emergency-call.png";
import HistoryIcon from "@mui/icons-material/History";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import AlternateEmailOutlinedIcon from "@mui/icons-material/AlternateEmailOutlined";
import WcOutlinedIcon from "@mui/icons-material/WcOutlined";
const CustomerDue = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [EmegencyData, setEmegencyData] = useState(null);
  const { Data, Amount, r_id } = location.state;

  useEffect(() => {
    // Fetch customer data from the API
    const fetchCustomerData = async () => {
      try {
        const response = await fetch(
          `http://${API_URL}/User/Profile/${Data.phone}/`
        );
        const result = await response.json();
        setData(result.data);
        setEmegencyData(result.emergency);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    fetchCustomerData();
  }, [Data.phone]);

  // Render loading state if data is not yet fetched
  if (!data) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen flex    justify-center items-center p-6">
      <div className="bg-white rounded-2xl  p-8 w-full max-w-3xl">
        {/* Profile Picture at Top Left */}
        <div className="flex flex-row justify-between mb-12 items-center">
          {/* Profile Picture */}
          {/* <div>
            {data.ProfilePic ? (
              <a
                href={data.ProfilePic}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={data.ProfilePic}
                  alt="Profile"
                  className="rounded-full w-24 h-24 object-cover"
                />
              </a>
            ) : (
              <span>Nill</span>
            )}
          </div> */}

          {/* Due Button */}
          <div className="group cursor-pointer hover:bg-white hover:shadow-2xl hover:rounded-2xl transition-all duration-300 ease-in-out p-2">
            <button
              onClick={() =>
                navigate(`/Customer/pay/${Data.phone}/`, {
                  state: {
                    phone: Data.phone,
                    r_id: r_id,
                  },
                })
              }
              className="flex items-center space-x-2 text-black font-medium"
            >
              <CheckCircleOutlinedIcon className="text-2xl xxs:text-[12px] xs:text-[20px] ss:text-[25px] group-hover:text-green-600 transition-colors duration-300" />

              <span className="md:text-[18px] xxs:text-[12px] xs:text-[20px] ss:text-[25px]">
                Pay
              </span>
            </button>
          </div>

          {/* Customer Profile Title */}
          <div className="flex-grow flex justify-center ">
            <h1 className=" text-3xl xxs:text-[12px] xs:text-[20px] ss:text-[25px] font-bold font-poppins">
              Customer Profile
            </h1>
          </div>

          {/* CUSTOMER HISTORY  */}
          <button
            onClick={() => {
              console.log("daks");
              navigate(`/customerhistory`, {
                state: {
                  Data: data,
                  phone:Data.phone
                },
              });
            }}
          >
            <div className="group cursor-pointer hover:bg-white hover:shadow-2xl hover:rounded-2xl transition-all duration-300 ease-in-out p-2">
              {/* <Link to="/TodaysBusiness"> */}
              <HistoryIcon className="text-2xl md:text-[18px] xxs:text-[12px] xs:text-[20px] ss:text-[25px] mb-1 group-hover:text-blue-500 transition-colors duration-300" />
              <span className="text-black font-medium md:text-[18px] xxs:text-[12px] xs:text-[20px] ss:text-[25px]">
                {" "}
                History{" "}
              </span>
              {/* </Link> */}
            </div>
          </button>

          <div></div>
        </div>
        <div className="flex flex-col md:flex-row flex-wrap items-center justify-between gap-6 w-full mb-6">
          <div className="flex flex-col  justify-between p-4 sm:p-6 bg-white shadow-lg rounded-2xl w-full md:w-[48%]">
            <h1 className="font-poppins text-black mb-4 text-lg sm:text-xl">
              Personal Info.
            </h1>
            <div className="flex flex-row gap-4 justify-between w-full">
              <AccountCircleOutlinedIcon className="text-[20px] sm:text-[25px]" />
              <span className="text-sm sm:text-base">
                {data.name || "Nill"}
              </span>
            </div>
            <div className="flex flex-row gap-4 justify-between w-full">
              <PhoneInTalkIcon className="text-[20px] sm:text-[25px]" />
              <span className="text-sm sm:text-base">
                {Data.phone || "Nill"}
              </span>
            </div>
            <div className="flex flex-row gap-4 justify-between w-full">
              <AlternateEmailOutlinedIcon className="text-[20px] sm:text-[25px]" />
              <span className="text-sm sm:text-base">
                {data.email || "Nill"}
              </span>
            </div>
            <div className="flex flex-row gap-4 justify-between w-full">
              <WcOutlinedIcon className="text-[20px] sm:text-[25px]" />
              <span className="text-sm sm:text-base">
                {data.Gender || "Nill"}
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-between p-4 sm:p-6 bg-white shadow-lg rounded-2xl w-full md:w-[48%]">
            <h1 className="font-poppins text-black mb-4 text-lg sm:text-xl">
              Regional Info.
            </h1>
            <div className="flex justify-between">
              <span className="font-semibold text-sm sm:text-base">City:</span>
              <span className="text-sm sm:text-base">
                {data.City || "Nill"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-sm sm:text-base">State:</span>
              <span className="text-sm sm:text-base">
                {data.State || "Nill"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-sm sm:text-base">
                Country:
              </span>
              <span className="text-sm sm:text-base">
                {data.Country || "Nill"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-sm sm:text-base">
                Date of Birth:
              </span>
              <span className="text-sm sm:text-base">
                {data.Date_of_Birth || "Nill"}
              </span>
            </div>
          </div>
        </div>
        {/* EMERGENCY CONTACT DATA  */}
        <div className="bg-white  flex flex-col gap-2  shadow-lg rounded-2xl py-4 px-4">
          <div className="flex flex-row mb-4 items-center">
            <h1 className="font-poppins text-black">Emergency Details</h1>
            <img
              src={emergencyIcon}
              alt="Emergency Icon"
              className="w-[22px] h-[22px] ml-2"
            />
          </div>

          <div className="flex  justify-between">
            <span className="font-semibold">Emergency Name</span>
            <span>
              {EmegencyData
                ? EmegencyData[0].fname + " " + EmegencyData[0].lname
                : "Nill"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Emergency Contacts</span>
            <span>{EmegencyData ? EmegencyData[0].phone : "Nill"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Emergency Relations</span>
            <span>{EmegencyData ? EmegencyData[0].relation : "Nill"}</span>
          </div>
        </div>
        {/* EMERGENCY CONTACT DATA  */}
        {/* ADHAR LICENSE SIGNATURE  */}
        <div className="flex flex-col md:flex-row flex-wrap gap-4 sm:gap-6 mt-4 items-center w-full">
          <div className="flex flex-wrap justify-center md:justify-start gap-4 sm:gap-6">
            <div className="flex bg-white shadow-lg py-2 px-2 rounded-2xl flex-col gap-2 items-center w-24 sm:w-28">
              {data.Adhar_Card ? (
                <a
                  href={data.Adhar_Card}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={data.Adhar_Card}
                    alt="Aadhar Card"
                    className="w-20 sm:w-24 h-20 sm:h-24 rounded-2xl object-cover"
                  />
                </a>
              ) : (
                <span>Nill</span>
              )}
              <span className="text-black font-light text-xs sm:text-sm font-poppins">
                Aadhar Card
              </span>
            </div>

            <div className="flex bg-white shadow-lg py-2 px-2 rounded-2xl flex-col gap-2 items-center w-24 sm:w-28">
              {data.license_id ? (
                <a
                  href={data.license_id}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={data.license_id}
                    alt="License"
                    className="w-20 sm:w-24 h-20 sm:h-24 rounded-2xl object-cover"
                  />
                </a>
              ) : (
                <span>Nill</span>
              )}
              <span className="text-black font-light text-xs sm:text-sm font-poppins">
                License
              </span>
            </div>

            <div className="flex bg-white shadow-lg py-2 px-2 rounded-2xl flex-col gap-2 items-center w-24 sm:w-28">
              {data.Signature ? (
                <a
                  href={data.Signature}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={data.Signature}
                    alt="Signature"
                    className="w-20 sm:w-24 h-20 sm:h-24 rounded-2xl object-cover"
                  />
                </a>
              ) : (
                <span>Nill</span>
              )}
              <span className="text-black font-light text-xs sm:text-sm font-poppins">
                Signature
              </span>
            </div>
          </div>

          <div className="flex items-center bg-white px-4 py-4   sm:py-6 rounded-2xl shadow-lg border w-full md:w-auto justify-center md:justify-start">
            <div className="mr-2 flex items-center gap-2">
              <CurrencyRupeeOutlinedIcon className="text-green-600 text-xl sm:text-2xl" />
              <span className="text-green-600 text-sm sm:text-base font-poppins">
                {Amount || "Nill"}
              </span>
            </div>
            <span className="font-semibold text-sm sm:text-base font-poppins">
              Total Spend
            </span>
          </div>
        </div>
      
      </div>
    </div>
  );
};

export default CustomerDue;
