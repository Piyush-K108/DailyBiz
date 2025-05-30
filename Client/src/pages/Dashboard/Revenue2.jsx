import React, { useEffect, useState } from "react";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import StatBox from "../../components/bike-info-component/StatsOfbikes";
import LineChart from "../../components/Charts/LineChart";
import { RecyclingRounded } from "@mui/icons-material";
import BarChart from "../../components/Charts/BarChart";
import {
  todayRevenueData,
  monthlyRevenueData,
  weeklyRevenueData,
  yearlyRevenueData,
  PieData,
  MultiLineData,
} from "../../components/Charts/revenue";
import PieChart from "../../components/Charts/PieChart";
import MultiLineChart from "../../components/Charts/MultiLineChart";
import { API_URL } from "../../config";
import { Link, useNavigate } from "react-router-dom";
function Revenue2() {
  const navigate = useNavigate();
  const [TRevenue, setTRevenue] = useState(0);
  const [MRevenue, setMRevenue] = useState(0);
  const [WRevenue, setWRevenue] = useState(0);
  const [YRevenue, setYRevenue] = useState(0);

  const [labels, setLables] = useState([]);
  const [MultiData1, setMultiData1] = useState([]);
  const [MultiData2, setMultiData2] = useState([]);
  const [MultiData3, setMultiData3] = useState([]);
  const [MultiData4, setMultiData4] = useState([]);


  const [Mlabels, setMLables] = useState([]);
  const [MonthR, setMonthR] = useState([]);

  const [Wlabels, setWLables] = useState([]);
  const [WeekR, setWeekR] = useState([]);

  const [Ylabels, setYLables] = useState([]);
  const [YearR, setYearR] = useState([]);



  useEffect(() => {

    fetchMultiLineData();

    fetch_Year_Data();
    fetch_Month_Data();
    fetch_Week_Data();

    fetchTData();
    fetchWData();
    fetchMData();
    fetchYData();
  }, []);
  const formatDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const fetchTData = () => {
    const date = formatDate()
    fetch(`http://${API_URL}/Admin/TodayR/?date=${date}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("ad",responseJson.Revenue)
        setTRevenue(responseJson.Revenue);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const fetch_Week_Data = () => {
    fetch(`http://${API_URL}/Admin/WeeklyR/`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setWLables(responseJson.labels);
        setWeekR(responseJson.revenue);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetch_Month_Data = () => {
    fetch(`http://${API_URL}/Admin/MonthlyR/`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setMLables(responseJson.labels);
        setMonthR(responseJson.revenue);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetch_Year_Data = () => {
    fetch(`http://${API_URL}/Admin/YearlyR/`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setYLables(responseJson.labels);
        setYearR(responseJson.revenue);
      })
      .catch((error) => {
        console.log(error);
      });
  };


  const fetchMultiLineData = () => {
    fetch(`http://${API_URL}/Admin/DividedHourlyR/`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((responseJson) => {
        
        setLables(responseJson.labels);
        setMultiData1(responseJson.revenue);
        setMultiData2(responseJson.revenue_ev);
        setMultiData3(responseJson.revenue_petrol);
        setMultiData4(responseJson.advance);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  
  const fetchWData = () => {
    fetch(`http://${API_URL}/Admin/WeekR/`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setWRevenue(responseJson.Revenue);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const fetchMData = () => {
    const currentDate = new Date();
    const lastMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1
    );
    const year = lastMonth.getFullYear();
    const month = String(lastMonth.getMonth() + 1).padStart(2, "0");
    
    fetch(`http://${API_URL}/Admin/MonthR/?month=${month}&year=${year}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setMRevenue(responseJson.Revenue);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const fetchYData = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    
    fetch(`http://${API_URL}/Admin/YearR/?year=${year}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setYRevenue(responseJson.Revenue);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (


    <div className="bg-white flex flex-col  h-[100%] ">
      <h1 className="text-2xl sm:text-4xl text-start items-start mt-2 ml-2 text-black font-bold">
        Suppose to Be
        <RecyclingRounded onClick={()=> navigate("/revenue")} />
      </h1>
      <div className="grid grid-cols-2  items-center sm:grid-cols-4 gap-6 mt-8 ml-8">
        <StatBox
          title="Todays Revenue"
          value={TRevenue}
          icon={<CurrencyRupeeIcon fontSize="0" />}
        />

        <StatBox
          // last 7 days
          title="Weekly Revenue"
          value={WRevenue}
          icon={<CurrencyRupeeIcon fontSize="0" />}
        />
        <StatBox
          title="Monthly Revenue"
          value={MRevenue}
          icon={<CurrencyRupeeIcon fontSize="0" />}
        />
        <StatBox
          title="Yearly Revenue"
          value={YRevenue}
          icon={<CurrencyRupeeIcon fontSize="0" />}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 ml-8">
        <div className="bg-white p-4 h-[300px] sm:h-[400px] w-3/3 sm:w-3/3  mr-8 sm:ml-8 mt-8 mb-8 rounded-lg shadow-lg">
          <div className="text-center text-2xl font-bold">Hourly Revenue</div>
          {/* <div className="w-auto h-96 bg-blue-500 rounded-lg"> */}
          <MultiLineChart
            data={MultiLineData(labels, MultiData1, MultiData2, MultiData3,MultiData4)}
          />
          {/* </div> */}
        </div>

        <div className=" flex flex-col items-center justify-center bg-white p-4 h-[400px] w-3/3  mr-8 sm:ml-8  mt-8 mb-8 rounded-lg shadow-lg">
          <div className="text-center  text-2xl font-bold">Weekly Revenue</div>
          <PieChart data={PieData(Wlabels, WeekR)} />
        </div>

        <div className="bg-white p-4 h-[400px] w-3/3 sm:w-3/3 mt-8 mr-8 sm:ml-8 rounded-lg shadow-lg">
          <div className="text-center text-2xl font-bold">Monthly Revenue</div>
          {/* <div className="w-auto h-96 bg-blue-500 rounded-lg"> */}
          <BarChart data={monthlyRevenueData(Mlabels, MonthR)} />
          {/* </div> */}
        </div>

        <div className="bg-white p-4 h-[400px] w-3/3  mr-8 sm:ml-8 mt-8 mb-8 rounded-lg shadow-lg">
          <div className="text-center text-2xl font-bold">Yearly Revenue</div>
          {/* <div className="w-auto h-96 bg-blue-500 rounded-lg"> */}
          <BarChart data={yearlyRevenueData(Ylabels, YearR)} />
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}

export default Revenue2;