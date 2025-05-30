import React from "react";
import { PiCurrencyInr } from "react-icons/pi";
function StatBox({ title, value, icon, name, icon2 }) {
  return (
    <div className="group hover:bg-black hover:text-yellow-400 flex justify-start items-center  bg-yellow-400 text-black px-2 py-8  rounded-lg shadow-md sm:w-34 md:w-56  w-36 h-24 mr-2 transition duration-800 ease-in-out transform hover:scale-105 ">
      {icon && (
        <div className="group-hover:text-yellow-400 sm:mt-8 mt-8  items-center text-1xl sm:text-2xl">
          {icon}
        </div>
      )}
      <div className="flex flex-col">
        <p className="group-hover:text-yellow-400 text-sm px-1  sm:text-base md:text-lg">
          {title}
        </p>
        <div className="flex flex-row items-center justify-around">
          <span
            className={`group-hover:text-yellow-400 text-2xl hover:text-yellow-400 sm:text-3xl  ${
              name === "hours" ? "md:text-3xl" : "md:text-4xl"
            } font-bold`}
          >
            {value}
          </span>
          {icon2 === "RS" ? (
            <div className="group-hover:text-yellow-400 ml-10 mt-2 items-center hover:text-yellow-400 text-2xl sm:text-3xl">
              <PiCurrencyInr />
            </div>
          ) : (
            <div className="group-hover:text-yellow-400 items-center ml-4 hover:text-yellow-400 text-2xl sm:text-3xl">
              {icon2}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StatBox;
