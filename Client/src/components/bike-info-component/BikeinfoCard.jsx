import React, { useState } from "react";

function BikeInfoCard({ title, data }) {
  const [hoveredRow, setHoveredRow] = useState(null);

  const handleMouseEnter = (rowIndex) => {
    setHoveredRow(rowIndex);
  };

  const handleMouseLeave = () => {
    setHoveredRow(null);
  };

  return (
    <div className="p-4 flex flex-col">
      <p className="text-lg font-semibold bg-yellow-400 text-center py-1 rounded-lg mb-2">
        {title}
      </p>
      {Array.isArray(data) ? (
        data.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`flex items-center justify-center pb-2 w-full border-b border-gray-300 ${
              hoveredRow === rowIndex ? "bg-gray-300" : "bg-gray-100"
            }`}
            onMouseEnter={() => handleMouseEnter(rowIndex)}
            onMouseLeave={handleMouseLeave}
          >
            {Array.isArray(row) ? (
              row.map((item, itemIndex) => (
                <p key={itemIndex} className="text-xl mr-2">
                  {item}
                </p>
              ))
            ) : (
              <p className="text-xl">{row}</p>
            )}
          </div>
        ))
      ) : (
        <div
          className={`flex items-center justify-center pb-2 w-full border-b border-gray-300 ${
            hoveredRow === 0 ? "bg-gray-300" : "bg-gray-100"
          }`}
          onMouseEnter={() => handleMouseEnter(0)}
          onMouseLeave={handleMouseLeave}
        >
          <p className="text-xl">{data}</p>
        </div>
      )}
    </div>
  );
}

export default BikeInfoCard;
