import React, { Fragment, useState,useEffect } from "react";
import styled from "styled-components";
import { BiSearch } from "react-icons/bi";
import { logout } from "../../Redux/Counter/counterAction";
import { useNavigate } from "react-router-dom";
import { Menu, Popover, Transition } from "@headlessui/react";
import {
  HiOutlineBell,
  HiOutlineChatAlt,
} from "react-icons/hi";
import { useDispatch } from "react-redux";
import { API_URL } from "../../config";

export default function Navbar() {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [adminData, setData] = useState([]);
  const phone = localStorage.getItem('phone')
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());

    navigate("/login");
  };
  useEffect(() => {
    fetchData();
  }, []);

   const fetchData = () => {
    console.log(phone)
    fetch(`http://${API_URL}/Admin/admin-data/`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseJson) => {
       
        const filteredData = responseJson.filter(admin => parseInt(admin.phone) === parseInt(phone));
        setData(filteredData[0]);
      
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <Section className="hidden lg:block">
      <Nav>
        <div className="search ">
          <BiSearch />
          <input type="text" placeholder="Search" />
        </div>
        <div className="relative text-black hidden lg:block">
          <div className="flex  items-center gap-9 mt-1 sm:mt-8  sm:gap-4 md:gap-6 lg:gap-9 ml-8 sm:ml-4 md:ml-6  lg:ml-[120%]">
            <Popover className="relative">
              {({ open }) => (
                <>
                  <Popover.Button
                    className={` inline-flex items-center rounded-sm p-1.5 text-gray-700 ${
                      open ? "text-opacity-100" : ""
                    } focus:outline-none`}
                  >
                    <HiOutlineChatAlt fontSize={24} />
                  </Popover.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel className="absolute right-0 z-10 mt-2.5 transform w-80">
                      <div className="bg-white rounded-sm shadow-md ring-1 ring-black ring-opacity-5 px-2 py-2.5">
                        <strong className="text-gray-700 font-medium">
                          Messages
                        </strong>
                        <div className="mt-2 py-1 text-neutral-950 font-bold placeholder-black">
                          This is messages panel.
                        </div>
                      </div>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
            <Popover className="relative">
              {({ open }) => (
                <>
                  <Popover.Button
                    className={`group inline-flex items-center rounded-sm p-1.5 text-gray-700 ${
                      open ? "text-opacity-100" : ""
                    } focus:outline-none`}
                  >
                    <HiOutlineBell fontSize={24} />
                  </Popover.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel className="absolute right-0 z-10 mt-2.5 transform w-80">
                      <div className="bg-white rounded-sm shadow-md ring-1 ring-black ring-opacity-5 px-2 py-2.5">
                        <strong className="text-gray-700 font-medium">
                          Notifications
                        </strong>
                        <div className="mt-2 py-1 text-neutral-950 font-bold placeholder-black">
                          This is notification panel.
                        </div>
                      </div>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
            <Menu as="div" className="relative">
              <div>
                <Menu.Button>
                  <span className="sr-only">Open user menu</span>
                  <div className="h-10 w-10 rounded-full   bg-cover bg-no-repeat bg-center">
                    <img
                      src={
                        adminData
                          ? adminData.ProfilePic
                          : "src/assets/profile.jpeg"
                      }
                      className="rounded-full"
                      alt="User"
                    />
                    <span className="sr-only">Marc Backes</span>
                  </div>
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="origin-top-right z-10 absolute right-0   w-48 rounded-sm shadow-md p-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <div
                        onClick={() => navigate("/AdminProfile")}
                        className={`${
                          active ? "bg-gray-100" : ""
                        } rounded-sm px-4 py-2 text-gray-700 cursor-pointer focus:bg-gray-200`}
                      >
                        Your Profile
                      </div>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <div
                        onClick={() => navigate("/settings")}
                        className={`${
                          active ? "bg-gray-100" : ""
                        } rounded-sm px-4 py-2 text-gray-700 cursor-pointer focus:bg-gray-200`}
                      >
                        Settings
                      </div>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <div
                        onClick={handleLogout}
                        className={`${
                          active ? "bg-gray-100" : ""
                        } rounded-sm px-4 py-1 text-gray-700 cursor-pointer focus:bg-gray-200`}
                      >
                        Sign out
                      </div>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </Nav>
    </Section>
  );
}
const Nav = styled.nav`
  display: flex;
  justify-content: space-between;

  color: white;
  .title {
    h1 {
      span {
        margin-left: 0.5rem;
        color: #ffc107;
        font-family: "Permanent Marker", cursive;
        letter-spacing: 0.2rem;
      }
    }
  }
  .search {
    background-color: #212121;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 8rem 1rem 1rem;
    border-radius: 1rem;
    svg {
      color: #ffc107;
    }
    input {
      background-color: transparent;
      border: none;
      color: #ffc107;
      font-family: "Permanent Marker", cursive;
      letter-spacing: 0.3rem;
      &:focus {
        outline: none;
      }
      &::placeholder {
        color: #ffc107;
        font-family: "Permanent Marker", cursive;
      }
    }
  }
  @media screen and (min-width: 280px) and (max-width: 1080px) {
  
    flex-direction: column;
    .search{
      visibility: hidden;
    }
    .title {
      h1 {
        span {
          display: block;

          margin: 1rem 0;
          /* letter-spacing: 0; */
        }
      }
    }
  }
`;




const Section = styled.section`
  ${"" /* margin-left: 2vw; */}
  padding: 2rem;
  
  ${"" /* width: 100%; */}
  ${"" /* background-color: ; */}
  ${"" /* backdrop-filter: blur(10px); */}
  border-bottom:1px solid gray ;
 box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;

  padding-inline: 20%;
  .grid {
    display: flex;
    flex-direction: column;
    height: 100vh;
    gap: 1rem;
    margin-top: 2rem;
    .row__one {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      height: 50%;
      gap: 1rem;
    }
    .row__two {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      height: 50%;
    }
  }
  @media screen and (min-width: 280px) and (max-width: 1080px) {
    margin-left: 0;
    .grid {
      .row__one,
      .row__two {
        grid-template-columns: 1fr;
      }
    }
  }
`;