import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config";

function AdminProfile() {
  const [adminData, setAdminData] = useState({});
  const phone = localStorage.getItem("phone");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch(`http://${API_URL}/Admin/admin-data/`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((responseJson) => {
        const filteredData = responseJson
          .map((admin) => {
            const { ProfilePic, ...rest } = admin;
            return rest;
          })
          .find((admin) => parseInt(admin.phone) === parseInt(phone));

        setAdminData(filteredData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChangeData = async (contentType) => {
    setIsLoading(true);
  
    try {
      let updatedAdminData = { ...adminData };
  
      // Check if new password is provided and matches confirm password
      if (newPassword && confirmPassword && newPassword === confirmPassword) {
        updatedAdminData = {
          ...updatedAdminData,
          Password: newPassword,
        };
      }
      else{
      updatedAdminData = {...adminData} 
      }
  
      let config;
      console.log(updatedAdminData)
      if (contentType === "multipart/form-data") {
        config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };  
      }
  
      console.log(updatedAdminData);
      const response = await axios.put(
        `http://${API_URL}/User/Profile/${adminData.phone}/`,
        updatedAdminData,
        config,
      );
  
    

      
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error updating profile:", error);
    }
  };
  

  return (
    <div className="bg-white flex flex-col  h-[100%]">
      <div className="w-full p-4 sm:p-8">
        <div className="bg-white p-4 sm:p-8 rounded shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-black">User Profile</h1>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold">Name:</label>
              <input
                type="text"
                className="w-full px-4 py-2 mt-1 border rounded-md text-black"
                placeholder={adminData.name ? adminData.name : "Not specified"}
                value={adminData.name || ""}
                onChange={(e) =>
                  setAdminData({ ...adminData, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Phone:</label>
              <div className="w-full px-4 py-2 mt-1 border rounded-md text-black">
                {adminData.phone}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold">Email:</label>
              <input
                type="text"
                className="w-full px-4 py-2 mt-1 border rounded-md text-black"
                placeholder={
                  adminData.email ? adminData.email : "Not specified"
                }
                value={adminData.email || ""}
                onChange={(e) =>
                  setAdminData({ ...adminData, email: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">City:</label>
              <input
                type="text"
                className="w-full px-4 py-2 mt-1 border rounded-md text-black"
                placeholder={adminData.City ? adminData.City : "Not specified"}
                value={adminData.City || ""}
                onChange={(e) =>
                  setAdminData({ ...adminData, City: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">
                Date of Birth:
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 mt-1 border rounded-md text-black"
                placeholder={
                  adminData.Date_of_Birth
                    ? adminData.Date_of_Birth
                    : "Not specified"
                }
                value={adminData.Date_of_Birth || ""}
                onChange={(e) =>
                  setAdminData({ ...adminData, Date_of_Birth: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-semibold">
              Change Password:
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 mt-1 border rounded-md text-black"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="mt-4">
            <input
              type="password"
              className="w-full px-4 py-2 mt-1 border rounded-md text-black"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            className="mt-4 px-4 py-2 bg-yellow-500 text-black font-bold  rounded hover:bg-yellow-600 focus:outline-none focus:ring focus:ring-yellow-400"
            onClick={() => handleChangeData("application/json")}
            disabled={isLoading}
          >
            {isLoading ? "Updating Data..." : "Save Changes"}
          </button>

          {updateSuccess && (
            <p className="text-green-500 mt-2">Data updated successfully!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
