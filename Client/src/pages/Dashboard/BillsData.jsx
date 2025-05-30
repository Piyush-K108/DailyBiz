import React, { useEffect, useState } from "react";
import MyDatePicker from "../../components/DatePicker";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";

const BillData = () => {
  const [phone, setphone] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); 
  const day = String(today.getDate()).padStart(2, "0");
  const formattedToday = `${year}-${month}-${day}`;
  
  const [selectedDate, setSelectedDate] = useState(formattedToday);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://${API_URL}/Admin/Todays_Revenu_Exel/${selectedDate}`
      );
      const response2 = await fetch(
        `http://${API_URL}/Admin/Exel_User/${selectedDate}`
      );
      const Data = await response.json();
      const Data2 = await response2.json();
      const index = Data2.findIndex(item => item.phone === phone);
     
      navigate(`/Bills/${phone}/${selectedDate}/`, {
        state: { phone: phone, date: selectedDate, Data: Data[index] },
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white h-screen flex items-center justify-center">
      <div className="flex flex-col bg-white p-6 sm:p-10 rounded-lg shadow-lg w-full max-w-md">
        <label className="font-bold text-black mb-2">Phone number</label>
        <input
          type="number"
          placeholder="+91 (555) 000-000"
          value={phone}
          onChange={(e) => setphone(e.target.value)}
          className="w-full p-3 text-black border border-gray-300 rounded-lg focus:border-slate-600 shadow-sm"
        />

        <div className="mt-4">
          <MyDatePicker onDateChange={handleDateChange} />
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 rounded-lg bg-black text-white py-3 px-6 w-full text-center flex justify-center items-center"
          disabled={loading}
        >
          {loading ? (
            <div className="animate-pulse">Loading...</div>
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </div>
  );
};

export default BillData;
