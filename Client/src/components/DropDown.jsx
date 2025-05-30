import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { logout } from "../Redux/Counter/counterAction";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MopedOutlinedIcon from "@mui/icons-material/MopedOutlined";
import TimeToLeaveOutlinedIcon from "@mui/icons-material/TimeToLeaveOutlined";
export default function Dropdown({ isOpen, onClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <DropdownContainer isOpen={isOpen}>
      <ul>
        <li className="hover:bg-red">
          {" "}
          <Link
            to="/AdminProfile"
            className="flex appearance-none flex-row items-center justify-between bg-black text-yellow-400 p-2 shadow rounded"
          >
            <PermIdentityIcon className="text-xl" /> <span>My Profile</span>
          </Link>
        </li>

        <li>
          {" "}
          <Link
            to="/revenue"
            className="flex flex-row items-center text-yellow-400 justify-between bg-black p-2 shadow rounded"
          >
            <CreditScoreIcon className="text-xl" />
            <span>Revenue</span>
          </Link>
        </li>

        <li>
          {" "}
          <Link
            to="/Bikes"
            className="flex flex-row items-center text-yellow-400 justify-between bg-black p-2 shadow rounded"
          >
            <MopedOutlinedIcon className="text-xl" />
            <span>Bikes</span>
          </Link>
        </li>
        <li>
          {" "}
          <Link
            to="/cars"
            className="flex flex-row items-center text-yellow-400 justify-between bg-black p-2 shadow rounded"
          >
            <TimeToLeaveOutlinedIcon className="text-xl" />
            <span>Cars</span>
          </Link>
        </li>
        <li className="hover:bg-red">
          {" "}
          <Link
            to="/TodaysBusiness"
            className="flex flex-row items-center text-yellow-400 justify-between bg-black p-2 shadow rounded"
          >
            <WorkHistoryOutlinedIcon className="text-xl" />
            <span>Today's Business</span>
          </Link>
        </li>

        <li className="hover:bg-red">
          {" "}
          <Link
            to="/servicing"
            className="flex flex-row items-center text-yellow-400 justify-between bg-black p-2 shadow rounded"
          >
            <WorkHistoryOutlinedIcon className="text-xl" />
            <span>Servicing</span>
          </Link>
        </li>

        <li className="hover:bg-red">
          {" "}
          <Link
            to="/Bills"
            className="flex flex-row items-center text-yellow-400 justify-between bg-black p-2 shadow rounded"
          >
            <WorkHistoryOutlinedIcon className="text-xl" />
            <span>Generated Bills</span>
          </Link>
        </li>

        <li className="hover:bg-red">
          {" "}
          <Link
            to="/BikeUtility"
            className="flex flex-row items-center text-yellow-400 justify-between bg-black p-2 shadow rounded"
          >
            <WorkHistoryOutlinedIcon className="text-xl" />
            <span>Bike's Utility</span>
          </Link>
        </li>

        <li>
          {" "}
          <Link
            to="/TeamInfoData"
            className="flex flex-row items-center text-yellow-400 justify-between bg-black p-2 shadow rounded"
          >
            <GroupsOutlinedIcon className="text-xl" />
            <span>Team Management</span>
          </Link>
        </li>
        <li>
          {" "}
          <Link
            to="/Customer"
            className="flex flex-row items-center text-yellow-400 justify-between bg-black p-2 shadow rounded"
          >
            <ManageAccountsOutlinedIcon className="text-xl mr-2" />
            <span>Custom. Management</span>
          </Link>
        </li>
        <li>
          {" "}
          <button
            onClick={handleLogout}
            className="flex flex-row items-center  text-black justify-between p-2 shadow rounded"
          >
            <LogoutOutlinedIcon className="text-xl" />
            <span className="text-black">Logout</span>
          </button>
          {/* <BsFillChatTextFill /> */}
        </li>
      </ul>
      {/* <button onClick={onClose}>Close</button> */}
    </DropdownContainer>
  );
}

const DropdownContainer = styled.div`
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  position: absolute;
  top: 60px;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px;
  width: 240px; /* Set the width as per your design */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Add a box shadow for a subtle effect */
  z-index: 1;

  ul {
    list-style: none;
    padding: 0;
    ${"" /* background-color : #000 ; */}
  }

  li {
    padding: 4px;
    width: 100%;
    ${"" /* text-decoration: underline; */}

    cursor: pointer;
    transition: background-color 0.3s;
  }

  button {
    ${
      "" /* display: flex ;
    justifyContent:space-between ; */
    }
    width: 100%;
    padding: 4px;
    background-color: #ffc107;
    color: #000;
    border: none;
    cursor: pointer;
    outline: none;
    transition: background-color 0.3s;
  }
`;
