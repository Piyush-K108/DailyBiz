import React, { useState } from "react";

function MyDatePicker({ onDateChange }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  const formattedToday = `${year}-${month}-${day}`;

  const [selectedDate, setSelectedDate] = useState(formattedToday);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    onDateChange(e.target.value);
  };

  return (
    <div className="flex items-center space-x-2 xxs:mr-6 sm:mr-0 ">
      <label className="text-gray-700 xxs:text-[0.99rem] sm:text-xl xxs:w-24 sm:w-32">Select Date:</label>
      <input
        className="border-none bg-gray-200 rounded p-2 text-gray-700"
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
      />
    </div>
  );
}

export default MyDatePicker;