import React, { useState, useEffect } from "react";
import { redirect, useLocation } from "react-router-dom";
import PersonPinOutlinedIcon from "@mui/icons-material/PersonPinOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import LoadingAnimation from "../../components/LoadingAnimation";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import { API_URL } from "../../config";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Api, SaveRounded } from "@mui/icons-material";
import axios from "axios";
const Bills = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { phone, date, Data, index } = location.state;
  const [paymentMethods, setPaymentMethods] = useState({
    cash: false,
    upi: false,
    both: false,
    cheque: false,
  });
  const [AdvancePay, setAdvancePay] = useState({
    cash: false,
    upi: false,
    both: false,
    cheque: false,
    all: false,
  });
  const [invoiceData, setInvoiceData] = useState(null);
  const [Feedback, setFeedback] = useState("");
  const [Remark, setRemark] = useState("");
  const [editing, setEditing] = useState(false);
  const [RentalDate, setRentalDate] = useState(false);
  const [ReturnDate, setReturnDate] = useState(false);

  const [inputReturnDate, setInputReturnDate] = useState("");
  const [InputrentalDate, setInputentalDate] = useState("");
  const [OnlineMethod, setOnlineMethod] = useState("QR");

  const [KMNow, setKMNow] = useState(0);
  // const [Return, setReturn] = useState(0);
  const [Discount, setDiscount] = useState(0);
  const [Tip, setTip] = useState(0);
  const [Advance, setAdvance] = useState(0);
  const [Damage, setDamage] = useState(0);
  const [UPIMethod, setUPIMethod] = useState("");
  const [upi, setupi] = useState(0);
  const [cash, setcash] = useState(0);
  const [cheque, setcheque] = useState(0);

  // const handleChangeData = async (contentType, id) => {
  //   setLoading(true);

  //   try {
  //     let config;

  //     // rental_date: InputrentalDate===""?invoiceData.Data.rental_date:formatDateUpdate(InputrentalDate),
  //     // return_date: inputReturnDate===""?invoiceData.Data.return_date:formatDateUpdate(inputReturnDate),

  //     const data = {
  //       KM_For:
  //         KMNow === 0
  //           ? invoiceData.Data.KM_For
  //           : parseInt(KMNow) - invoiceData.Data.KM_Went,

  //       Amount:
  //         parseInt(Data.Amount) +
  //         (parseInt(Tip) !== 0 ? parseInt(Tip) : parseInt(Data.Tip)) +
  //         (parseInt(Damage) !== 0
  //           ? parseInt(Damage)
  //           : parseInt(invoiceData.Data.DamagePay)) +
  //         (parseInt(Advance) !== 0
  //           ? parseInt(Advance)
  //           : parseInt(Data.Advance)) -
  //         (parseInt(Discount) !== 0
  //           ? parseInt(Discount)
  //           : parseInt(Data.Discount)),

  //       Discount:
  //         parseInt(Discount) !== 0
  //           ? parseInt(Discount)
  //           : parseInt(Data.Discount),

  //       AdvancePay:
  //         Advance !== 0
  //           ? parseInt(Advance)
  //           : parseInt(invoiceData.Data.AdvancePay),

  //       AdvancePayUPI:
  //         Advance !== 0 && Object.keys(AdvancePay)[0] === "upi"
  //           ? parseInt(Advance)
  //           : parseInt(invoiceData.Data.AdvancePayUPI),

  //       AdvancePayCash:
  //         Advance !== 0 && Object.keys(AdvancePay)[0] === "cash"
  //           ? parseInt(Advance)
  //           : parseInt(invoiceData.Data.AdvancePayCash),

  //       Tip: parseInt(Tip) !== 0 ? parseInt(Tip) : parseInt(Data.Tip),

  //       DamagePay:
  //         parseInt(Damage) !== 0
  //           ? parseInt(Damage)
  //           : parseInt(invoiceData.Data.DamagePay),

  //       UPIMethod:
  //         Object.keys(paymentMethods)[0] === "upi" ||
  //         Object.keys(paymentMethods)[0] === "both"
  //           ? OnlineMethod === "QR"
  //             ? "QR - Code"
  //             : "Number"
  //           : "",
  //       upi:
  //         parseInt(upi) !== 0 ? parseInt(upi) : parseInt(invoiceData.Data.upi),
  //       cash:
  //         parseInt(cash) !== 0
  //           ? parseInt(cash)
  //           : parseInt(invoiceData.Data.cash),
  //       cheque:
  //         parseInt(cheque) !== 0
  //           ? parseInt(cheque)
  //           : parseInt(invoiceData.Data.cheque),
  //     };

  //     console.log(data);
  //     if (contentType === "multipart/form-data") {
  //       config = {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       };
  //     }

  //     const response = await axios.patch(
  //       `http://${API_URL}/Bike/Bill4/${invoiceData.Data.id}/`,
  //       data,
  //       config
  //     );

  //     console.log(response.data);

  //     setLoading(false);
  //   } catch (error) {
  //     setLoading(false);
  //     console.error("Error updating profile:", error);
  //   }
  // };

  const [loading, setLoading] = useState(true);
  const [num, setnum] = useState(0);

  const handleNext = () => {
    setLoading(true);
    setnum(num + 1); // Increment num by 1
  };

  // Function to handle previous button click
  const handlePrevious = () => {
    if (num > 0) {
      setLoading(true);
      setnum(num - 1); // Decrement num by 1, ensuring it doesn't go below 0
    } else {
      setnum(num+1)
      alert("No previous data available."); 
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://${API_URL}/Bike/Bill2/${phone}/${date}/${num}/`
        );
        if (response.ok) {
          const data = await response.json();
          setInvoiceData(data);

          // Set paymentMethods state based on fetched data
          setPaymentMethods({
            cash: data.Data.cash > 0,
            upi: data.Data.upi > 0,
            both: data.Data.cash > 0 && data.Data.upi > 0,
            cheque: data.Data.cheque > 0,
          });

          // Set AdvancePay state based on fetched data.Data
          setAdvancePay({
            cash: data.Data.AdvancePayCash > 0,
            upi: data.Data.AdvancePayUPI > 0,
            both: data.Data.AdvancePayCash > 0 && data.Data.AdvancePayUPI > 0,
            cheque: data.Data.cheque > 0,
            all:
              data.Data.AdvancePayCash > 0 ||
              data.Data.AdvancePayUPI > 0 ||
              data.Data.cheque > 0,
          });

          setLoading(false);
        } else {
          alert("No Data found !");
          navigate("/bills");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [phone, date, num]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setPaymentMethods(() => ({
      [name]: checked,
    }));
  };
  const handleCheckboxChange2 = (e) => {
    const { name, checked } = e.target;

    if (checked) {
      setAdvancePay(() => ({
        [name]: checked,
        all: true,
      }));
    } else {
      setAdvance(0);
      setAdvancePay(() => ({
        [name]: checked,
        [name]: false,
        all: false,
      }));
    }
  };
  const handleCheckboxChange3 = (e) => {
    const { name } = event.target;
    setFeedback(name);
  };

  //  human readable formate for date
  function formatDate(isoString) {
    const date = new Date(isoString);

    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = String(date.getUTCFullYear()).slice(-2);

    let hours = date.getUTCHours();
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12; // Convert to 12-hour format
    const formattedHours = String(hours).padStart(2, "0");

    return `${day}-${month}-${year} ${formattedHours}:${minutes} ${ampm}`;
  }

  const formatDateUpdate = (dateString, TimeString) => {
    const parts = dateString.split("-");
    const date = `${parts[0]}-${parts[1]}-${parts[2]}T`;
    const time = ``;
    return date;
  };  

  const handleDoubleClick = () => {
    setEditing(true);
    setKMNow(0);
  };

  const handleChange = (event) => {
    setKMNow(event.target.value);
  };

  const handleDoubleClickforRentalDate = () => {
    setRentalDate(true);
  };
  const handleDoubleClickReturnDate = () => {
    setReturnDate(true);
  };

  const handleFeedback = () => {
    const payload = {
      id: invoiceData.Data.id,
      feedback: Feedback, // This will be 'Correct', 'Wrong', or 'Hold'
      remark: Remark,
    };
    console.log(payload);
    fetch(`http://${API_URL}/Admin/Feedback/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Data submitted successfully:", data);
        navigate("/TodaysBusiness");
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
      });
  };

  return (
    <div className="flex items-center justify-center ">
      <div className="bg-white shadow-lg overflow-y-scroll no-scrollbar xxs:ml-[0px] xs:ml-[0px]  mt-[20px] mb-[20px] rounded-lg w-[1000px] h-[600px]">
        {loading ? (
          <LoadingAnimation title="Loading..." />
        ) : (
          <>
            {invoiceData && (
              <>
                <div className="bg-yellow-300 p-4 flex flex-row justify-between items-center w-full">
                  <div>
                    <h1 className="text-black font-medium">Invoice</h1>
                    <h1 className="text-black font-medium">
                      User Count - {invoiceData.Count}
                    </h1>
                  </div>
                  <button
                    onClick={() => {
                      console.log("index2", index);
                      navigate(`/Bills/${phone}/${date}/check/`, {
                        state: {
                          date: date,
                          index: index,
                        },
                      });
                    }}
                    className="flex items-center space-x-2 text-black font-medium hover:text-white hover:bg-yellow-400 p-2 rounded"
                  >
                    <FaCheckCircle className="text-xl" />
                    <span>Check</span>
                  </button>
                </div>
                <div className="lg:flex xxs:grid xs:grid xxs:grid-col-1 xs:justify-center xxs:justify-center lg:flex-row lg:justify-between lg:items-center px-2">
                  <div className="bg-white rounded-xl mt-2  shadow-sm px-8 py-8 flex gap-8 flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <h1 className="font-bold text-black">Customer info.</h1>
                      <PersonPinOutlinedIcon
                        fontSize="10px"
                        className="text-[25px]"
                      />
                    </div>

                    {/* Customer info */}
                    <div className="flex flex-row gap-8 justify-between w-full">
                      <p className="text-black">Full Name</p>
                      <h1 className="text-green-600 font-medium">
                        {invoiceData.Data.user.name || "Not provided"}
                      </h1>
                    </div>
                    <div className="flex flex-row gap-8 justify-between w-full">
                      <h1 className="text-black">Phone No.</h1>
                      <h1 className="text-green-600 font-medium">
                        {invoiceData.Data.user.phone}
                      </h1>
                    </div>
                    <div className="flex flex-row gap-8 justify-between w-full">
                      <h1 className="text-black">License Plate</h1>
                      <h1 className="text-green-600 font-medium">
                        {invoiceData.Data.bike.b_id}
                      </h1>
                    </div>
                  </div>

                  {/* Killo meter info  */}
                  <div className="bg-white rounded-xl mt-2 ml-2 shadow-sm px-8 py-8 w-[27%]  flex gap-8 flex-col justify-between ">
                    <div className="flex items-center justify-between">
                      <h1 className="font-bold text-black">KM info.</h1>
                      <QueryStatsIcon fontSize="10px" className="text-[25px]" />
                    </div>

                    <div className="flex flex-row gap-8 justify-between w-full">
                      <p className="text-black">KM Before</p>
                      <h1 className="text-green-600 font-medium">
                        {invoiceData.Data.KM_Went || "Not provided"}
                      </h1>
                    </div>
                    {editing ? (
                      <div className="flex flex-row gap-8 justify-between w-full">
                        <h1 className="text-black">KM Now</h1>
                        <div className="flex-grow flex items-end relative">
                          <input
                            type="text"
                            className="text-green-600 font-medium flex-grow "
                            value={KMNow}
                            onChange={handleChange}
                          />
                          <button
                            className="text-green-600 text-[15px] absolute right-0 top-0 bottom-0 bg-transparent border-none px-3 flex items-center"
                            onClick={() => setEditing(false)}
                          >
                            <SaveRounded
                              fontSize="10px"
                              className="text-[25px]"
                            />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onDoubleClick={handleDoubleClick}
                        className="flex flex-row gap-8 justify-between w-full"
                      >
                        <h1 className="text-black">KM Came</h1>
                        <h1 className="text-green-600 font-medium">
                          {KMNow === 0
                            ? invoiceData.Data.KM_For + invoiceData.Data.KM_Went
                            : KMNow}
                        </h1>
                      </div>
                    )}

                    <div className="flex flex-row gap-8 justify-between w-full">
                      <h1 className="text-black">KM For</h1>
                      <h1 className="text-green-600 font-medium">
                        {invoiceData.Data.KM_For}
                      </h1>
                    </div>
                  </div>

                  {/* REntal info  */}
                  <div className="bg-white rounded-xl mt-2 ml-2 shadow-sm px-8 py-8 flex gap-8 flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <h1 className="font-bold text-black">Rental Dates</h1>
                      <CalendarMonthOutlinedIcon
                        fontSize="10px"
                        className="text-[25px]"
                      />
                    </div>

                    {/* Rental date info */}
                    {RentalDate ? (
                      <div className="flex flex-row gap-8 justify-between w-full">
                        <h1 className="text-black">Rental Date</h1>
                        <div className="flex-grow flex items-end relative">
                          <input
                            type="date"
                            className="text-green-600 font-medium flex-grow "
                            value={InputrentalDate}
                            onChange={(e) => setInputentalDate(e.target.value)}
                          />
                          {/* <button
                              className="text-green-600 text-[15px] absolute right-0 top-0 bottom-0 bg-transparent border-none px-3 flex items-center"
                              onClick={handleSaveRentalDate}
                            > */}
                          <SaveRounded
                            onClick={() => setRentalDate(false)}
                            fontSize="10px"
                            className="text-[25px]"
                          />
                          {/* </button> */}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div
                          className="flex flex-row gap-8 justify-between w-full"
                          onDoubleClick={handleDoubleClickforRentalDate}
                        >
                          <p className="text-black">Rental Date</p>
                          <h1 className="text-green-600 font-medium">
                            {formatDate(invoiceData.Data.rental_date)}
                          </h1>
                        </div>
                      </>
                    )}

                    {/* Retrun Da */}

                    {ReturnDate ? (
                      <div className="flex flex-row gap-8 justify-between w-full">
                        <h1 className="text-black">Return Date</h1>
                        <div className="flex-grow flex items-end relative">
                          <input
                            type="date"
                            className="text-green-600 font-medium flex-grow "
                            value={inputReturnDate}
                            onChange={(e) => setInputReturnDate(e.target.value)}
                          />
                          {/* <button
                              className="text-green-600 text-[15px] absolute right-0 top-0 bottom-0 bg-transparent border-none px-3 flex items-center"
                              onClick={handleSaveRentalDate}
                            > */}
                          <SaveRounded
                            onClick={() => setReturnDate(0)}
                            fontSize="10px"
                            className="text-[25px]"
                          />
                          {/* </button> */}
                        </div>
                      </div>
                    ) : (
                      <div
                        className="flex flex-row gap-8 justify-between w-full"
                        onDoubleClick={handleDoubleClickReturnDate}
                      >
                        <h1 className="text-black">Return Date</h1>
                        <h1 className="text-green-600 font-medium">
                          {formatDate(invoiceData.Data.return_date)}
                        </h1>
                      </div>
                    )}

                    <div className="flex flex-row gap-8 justify-between w-full">
                      <h1 className="text-black">License Plate</h1>
                      <h1 className="text-green-600 font-medium">
                        {invoiceData.Data.bike.b_id}
                      </h1>
                    </div>
                  </div>
                  {/* Other sections */}
                  {/* Include similar sections for kilometer info and rental dates */}
                </div>

                {/* Input fields  */}
                <div className="flex flex-col gap-8 py-4 px-8 mt-8">
                  <div className="flex flex-col">
                    <label
                      htmlFor="discount"
                      className="text-sm font-medium text-gray-700"
                    >
                      Discount
                    </label>
                    <input
                      id="discount"
                      type="number"
                      onChange={(e) => setDiscount(parseInt(e.target.value))}
                      placeholder={
                        invoiceData.Data.Discount === 0
                          ? 0
                          : invoiceData.Data.Discount
                      }
                      className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="tip"
                      className="text-sm font-medium text-gray-700"
                    >
                      Tip
                    </label>
                    <input
                      id="tip"
                      type="number"
                      onChange={(e) => setTip(parseInt(e.target.value))}
                      placeholder={
                        invoiceData.Data.Tip === 0 ? 0 : invoiceData.Data.Tip
                      }
                      className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="Damage"
                      className="text-sm font-medium text-gray-700"
                    >
                      Damage
                    </label>
                    <input
                      id="Damage"
                      type="number"
                      onChange={(e) => setDamage(parseInt(e.target.value))}
                      placeholder={
                        invoiceData.Data.DamagePay === 0
                          ? 0
                          : invoiceData.Data.DamagePay
                      }
                      className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="lg:flex xxs:grid  lg:flex-row   pb-4 px-8  gap-4">
                  <div className="w-[50%]">
                    <div>Advance Pay</div>
                    <div className="flex gap-2">
                      <label htmlFor="cash2" className="flex items-center">
                        <input
                          id="cash2"
                          type="checkbox"
                          name="cash"
                          checked={AdvancePay.cash}
                          onChange={handleCheckboxChange2}
                        />
                        <span className="ml-2">Cash</span>
                      </label>
                      <label htmlFor="upi2" className="flex items-center">
                        <input
                          id="upi2"
                          type="checkbox"
                          name="upi"
                          checked={AdvancePay.upi}
                          onChange={handleCheckboxChange2}
                        />
                        <span className="ml-2">UPI</span>
                      </label>
                      {/* <label htmlFor="both2" className="flex items-center">
                          <input
                            id="both2"
                            type="checkbox"
                            name="both"
                            checked={AdvancePay.both}
                            onChange={handleCheckboxChange2}
                          />
                          <span className="ml-2">Both</span>
                        </label> */}
                      <label htmlFor="cheque2" className="flex items-center">
                        <input
                          id="cheque2"
                          type="checkbox"
                          name="cheque"
                          checked={AdvancePay.cheque}
                          onChange={handleCheckboxChange2}
                        />
                        <span className="ml-2">Cheque</span>
                      </label>
                    </div>

                    {AdvancePay.all && (
                      <input
                        type="text"
                        name="Advance"
                        className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-indigo-500"
                        placeholder={`${Data.Advance}`}
                        onChange={(event) => setAdvance(event.target.value)}
                      />
                    )}
                  </div>
                  <div className="w-[50%] xxs:pt-4 pt-0">
                    <div>Payment Method</div>
                    <div className="flex gap-2">
                      <label htmlFor="cash" className="flex items-center">
                        <input
                          id="cash"
                          type="checkbox"
                          name="cash"
                          checked={paymentMethods.cash}
                          onChange={handleCheckboxChange}
                        />
                        <span className="ml-2">Cash</span>
                      </label>
                      <label htmlFor="upi" className="flex items-center">
                        <input
                          id="upi"
                          type="checkbox"
                          name="upi"
                          checked={paymentMethods.upi}
                          onChange={handleCheckboxChange}
                        />
                        <span className="ml-2">UPI</span>
                      </label>
                      <label htmlFor="both" className="flex items-center">
                        <input
                          id="both"
                          type="checkbox"
                          name="both"
                          checked={paymentMethods.both}
                          onChange={handleCheckboxChange}
                        />
                        <span className="ml-2">Both</span>
                      </label>
                      <label htmlFor="cheque" className="flex items-center">
                        <input
                          id="cheque"
                          type="checkbox"
                          name="cheque"
                          checked={paymentMethods.cheque}
                          onChange={handleCheckboxChange}
                        />
                        <span className="ml-2">Cheque</span>
                      </label>
                    </div>
                    {paymentMethods.upi ? (
                      <input
                        type="number"
                        name="Advance"
                        className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-indigo-500"
                        placeholder={`${invoiceData.Data.upi}`}
                        value={upi || ""}
                        onChange={(event) => {
                          setupi(parseInt(event.target.value));
                          setcash(0);
                          setcheque(0);
                        }}
                      />
                    ) : paymentMethods.cash ? (
                      <input
                        type="number"
                        name="Advance"
                        className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-indigo-500"
                        placeholder={`${invoiceData.Data.cash}`}
                        value={cash || ""}
                        onChange={(event) => {
                          setcash(parseInt(event.target.value));
                          setupi(0);
                          setcheque(0);
                        }}
                      />
                    ) : paymentMethods.cheque ? (
                      <input
                        type="number"
                        name="Amount"
                        className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-indigo-500"
                        placeholder={`${invoiceData.Data.cheque}`}
                        value={cheque || ""}
                        onChange={(event) => {
                          setcheque(parseInt(event.target.value));
                          setcash(0);
                          setupi(0);
                        }}
                      />
                    ) : paymentMethods.both ? (
                      <div className="flex gap-4">
                        <input
                          type="number"
                          name="Amount"
                          className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-indigo-500"
                          placeholder={`upi = ${invoiceData.Data.upi}`}
                          value={upi || ""}
                          onChange={(event) => {
                            setupi(parseInt(event.target.value));
                            setcheque(0);
                          }}
                        />
                        <input
                          type="number"
                          name="Amount"
                          className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-indigo-500"
                          placeholder={`cash = ${invoiceData.Data.cash}`}
                          value={cash || ""}
                          onChange={(event) => {
                            setcash(parseInt(event.target.value));
                            setcheque(0);
                          }}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="bg-white shadow-md px-8 py-6 rounded-2xl mb-6 mt-8 w-[80%] flex flex-col gap-4">
                    <div className="flex flex-row items-center justify-between">
                      <h1 className="text-black font-medium">Advance Payed</h1>
                      <p className="text-green-600 font-semibold">
                        <CurrencyRupeeOutlinedIcon
                          fontSize="2"
                          className="text-[20px]"
                        />{" "}
                        {parseInt(Data.Advance)}
                      </p>
                    </div>
                    <div className="flex flex-row items-center justify-between">
                      <h1 className="text-black font-medium">Exact Amount</h1>
                      <p className="text-green-600 font-semibold">
                        <CurrencyRupeeOutlinedIcon
                          fontSize="2"
                          className="text-[20px]"
                        />{" "}
                        {Data.Amount}
                      </p>
                    </div>
                    <div className="flex flex-row items-center justify-between">
                      <h1 className="text-black font-medium">Total Amount</h1>
                      <p className="text-green-600 font-semibold">
                        <CurrencyRupeeOutlinedIcon
                          fontSize="2"
                          className="text-[20px]"
                        />{" "}
                        {parseInt(Data.Amount) +
                          parseInt(Data.Tip) +
                          parseInt(invoiceData.Data.DamagePay) +
                          parseInt(Data.Advance) -
                          parseInt(Data.Discount)}
                      </p>
                    </div>
                    <div className="flex flex-row items-center justify-between">
                      <h1 className="text-black font-medium">Feedback</h1>
                      <div className="flex flex-row gap-4 mt-1">
                        <label htmlFor="Correct" className="flex items-center">
                          <input
                            id="Correct"
                            type="checkbox"
                            name="Correct"
                            checked={Feedback === "Correct"}
                            onChange={handleCheckboxChange3}
                          />
                          <span className="ml-2">Correct</span>
                        </label>
                        <label htmlFor="Wrong" className="flex items-center">
                          <input
                            id="Wrong"
                            type="checkbox"
                            name="Wrong"
                            checked={Feedback === "Wrong"}
                            onChange={handleCheckboxChange3}
                          />
                          <span className="ml-2">Wrong</span>
                        </label>
                        <label htmlFor="Hold" className="flex items-center">
                          <input
                            id="Hold"
                            type="checkbox"
                            name="Hold"
                            checked={Feedback === "Hold"}
                            onChange={handleCheckboxChange3}
                          />
                          <span className="ml-2">Hold</span>
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="text"
                          name="Remark"
                          placeholder="Remark"
                          value={Remark}
                          className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-indigo-500"
                          onChange={(event) => setRemark(event.target.value)}
                        />
                      </div>
                    </div>

                    <button
                      className="mt-4 px-4 py-2 bg-yellow-500 text-black font-bold  rounded hover:bg-yellow-600 focus:outline-none focus:ring focus:ring-yellow-400"
                      onClick={() => handleFeedback()}
                      disabled={loading}
                    >
                      {loading ? "Updating Data..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </>
            )}
            <>
              <div className="flex justify-between px-8 py-4">
                <button
                  onClick={()=>handlePrevious()}
                  className="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded hover:bg-gray-300 focus:outline-none"
                >
                  Previous
                </button>
                <h1>{num}</h1>
                <button
                  onClick={()=>handleNext()}
                  className="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded hover:bg-gray-300 focus:outline-none"
                >
                  Next
                </button>
              </div>
            </>
          </>
        )}
      </div>{" "}
    </div>
  );
};

export default Bills;

// <button
// className="mt-4 px-4 py-2 bg-yellow-500 text-black font-bold  rounded hover:bg-yellow-600 focus:outline-none focus:ring focus:ring-yellow-400"
// onClick={() =>
//   handleChangeData(
//     "application/json",
//     invoiceData.Data.id
//   )
// }
// disabled={loading}
// >
// {loading ? "Updating Data..." : "Save Changes"}
// </button>
