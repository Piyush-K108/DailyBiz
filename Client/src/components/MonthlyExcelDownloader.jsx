import React, { useState } from "react";
import * as XLSX from "xlsx";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

const MonthlyExcelDownloader = () => {
  const [loading, setLoading] = useState(false);

  const today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth(); // Previous month (0-11)

  // Handle January case (go back to December of previous year)
  if (month === 0) {
    month = 12;
    year -= 1;
  }

  const daysInMonth = new Date(year, month, 0).getDate(); // Correct number of days
  const allDates = Array.from({ length: daysInMonth }, (_, i) => 
    `${year}-${String(month).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`
  );
  

  // For testing, we will only fetch data for the 1st and 2nd day of the month
  const testDates = [`${year}-${String(month).padStart(2, "0")}-01`, `${year}-${String(month).padStart(2, "0")}-02`];

  const fetchDailyData = async (date) => {
    try {
      const detailsResponse = await fetch(`http://${API_URL}/Admin/Todays_Revenu_Exel/${date}/`);
      const userResponse = await fetch(`http://${API_URL}/Admin/Exel_User/${date}/`);

      const detailsData = await detailsResponse.json();
      const userData = await userResponse.json();

      return detailsData.map((bike, index) => ({
        ...bike,
        user_name: userData[index]?.name || "N/A",
        user_phone: userData[index]?.phone || "N/A",
        date: date, // Include date for better organization
      }));
    } catch (error) {
      console.error(`Error fetching data for ${date}:`, error);
      return [];
    }
  };

  const fetchAndDownloadExcel = async () => {
    setLoading(true);
    let allData = [];

    // Fetch data for only 2 days for testing
    for (let date of allDates) {
      console.log("Fetching data for", date);
      const dailyData = await fetchDailyData(date);
      console.log("Fetched data ", dailyData);
      allData = [...allData, ...dailyData];
    }

    setLoading(false);

    if (allData.length === 0) {
      alert("No data found for the selected dates.");
      return;
    }

    // Organizing data by date
    let groupedData = {};
    allData.forEach((entry) => {
      if (!groupedData[entry.date]) {
        groupedData[entry.date] = [];
      }
      groupedData[entry.date].push(entry);
    });

    const wb = XLSX.utils.book_new();

    // Create separate sheets for each date
    Object.keys(groupedData).forEach((date) => {
      const sheetData = [
        [
          "Bike_ID",
          "Rental_date",
          "Return_date",
          "Rental_date_time",
          "Return_date_time",
          "KM_Went",
          "KM_Came",
          "KM_For",
          "Hours",
          "Minutes",
          "Decimal_Hours",
          "Amount",
          "Advance",
          "FinalAmount",
          "Mode",
          "Discount",
          "Tip",
          "Customer_Name",
          "Contact",
        ],
        ...groupedData[date].map((bike) => [
          bike.bike_id,
          bike.Rental_date,
          bike.Return_date,
          bike.Rental_date_time,
          bike.Return_date_time,
          bike.KM_Went,
          bike.KM_For + bike.KM_Went,
          bike.KM_For,
          bike.hours,
          bike.minutes,
          bike.decimal_hours,
          bike.Amount,
          bike.Advance,
          bike.Amount - bike.Discount + bike.Tip,
          bike.Mode,
          bike.Discount,
          bike.Tip,
          bike.user_name,
          bike.user_phone,
        ]),
      ];

      const ws = XLSX.utils.aoa_to_sheet(sheetData);
      ws["!cols"] = Array(sheetData[0].length).fill({ wch: 18 });
      XLSX.utils.book_append_sheet(wb, ws, date); // Each sheet named by date
    });

    XLSX.writeFile(wb, `business_report_${year}_${month}.xlsx`);
  };

  return (
    <div className="flex flex-row items-center cursor-pointer sm:mt-0">
      <div className="space-x-10 flex flex-row">
        <h1
          onClick={fetchAndDownloadExcel}
          className="hover:text-yellow-500 hover:underline hidden sm:block"
        >
          <CloudDownloadIcon className="mr-4 hover:text-yellow-400" />
          {loading ? "Fetching Data..." : "Download Monthly Excel"}
        </h1>
      </div>
    </div>
  );
};

export default MonthlyExcelDownloader;
