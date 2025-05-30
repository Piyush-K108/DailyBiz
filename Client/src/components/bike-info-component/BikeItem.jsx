import React, { useState } from "react";
import "../../pages/Dashboard/Mybike/Bikes.css";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import Bike from "../../assets/Bike.jpg";
const BikeItem = (props) => {
  const {
    b_id,
    Electrical,
    KM_Now,
    license_plate,
    Pic_before,
    Total_Earned,
    is_assigned,
    is_attached,
    Condition,
  } = props.item;

  const [isHovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const handleDeleteBike = () => {
    props.onDelete(b_id);
  };
  return (
    <div
      className="car__item"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="car__item-top">
        {is_assigned ? (
          <div className="rounded-full h-3 w-3 bg-green-500"></div>
        ) : !Condition ? (
          <div className="rounded-full h-3 w-3 bg-[#e2741a]"></div>
        ) : (
          <div className="rounded-full h-3 w-3 bg-[#f00]"></div>
        )}
        <div className="car__item-tile">
          <h3 style={{ color: "white", fontWeight: "400" }}>{license_plate}</h3>
        </div>
        <p style={{ color: "white", fontWeight: "400" }}>{b_id}</p>
        <DeleteForeverIcon
          className="text-red-500    text-3xl hover:text-red-800 cursor-pointer"
          fontSize="0"
          onClick={handleDeleteBike}
        />
        {isHovered && (
          <EditIcon
            className="text-yellow-400"
            onClick={() => {
              // Handle the click event to navigate to a different screen
              navigate(`/EditBike/${b_id}`);
            }}
          />
        )}
      </div>

      <div className="car__img">
        <img src={Bike} alt="sdsds" />
      </div>

      <div className="car__item-bottom">
        <div className="car__bottom-left">
          <p className="Km-now">KM- {KM_Now}</p>
          <p className="ev">{Electrical}</p>
        </div>

        <p className="car__rent">₹-{Total_Earned}</p>
      </div>
    </div>
  );
};

export default BikeItem;
