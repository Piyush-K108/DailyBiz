import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../config";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";

const Rental = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state;

  const [rentalData, setRentalData] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchRentalData = async () => {
    try {
      const response = await axios.get(
        `http://${API_URL}/Admin/rental/${id}/`
      );
      const data = response.data.data[0];
      setRentalData(data);
      setFormData(data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching rental data.");
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRentalData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name=='UPIMethod' && value===''){
      setFormData({ ...formData, [name]: 'QR' });
    }else{

      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = async () => {
    delete formData["user"];
    delete formData["bike"];
    
    try {
      await axios.put(`http://${API_URL}/Admin/changeretnal/${id}`, formData);
      fetchRentalData();

      setIsEditing(false);
    } catch (err) {
      setError("Error updating rental data.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="bg-white flex flex-col  h-[100%]  p-6">
      {rentalData ? (
        <div>
          <h1 className="text-3xl font-semibold mb-6 text-gray-800">
            Rental Details
          </h1>
          {isEditing ? (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {/* Rental Date */}
              <div className="flex flex-col bg-blue-50 p-4 rounded-lg shadow-md">
                <label className="font-medium text-gray-700 mb-2">
                  Rental Date
                </label>
                <input
                  type="date"
                  name="rental_date"
                  value={formData.rental_date?.substring(0, 10) || ""}
                  onChange={handleChange}
                  className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Time Thought */}
              <div className="flex flex-col bg-blue-50 p-4 rounded-lg shadow-md">
                <label className="font-medium text-gray-700 mb-2">
                  Time Thought
                </label>
                <input
                  type="text"
                  name="TimeThought"
                  value={formData.TimeThought || ""}
                  onChange={handleChange}
                  className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* KM Went */}
              <div className="flex flex-col bg-blue-50 p-4 rounded-lg shadow-md">
                <label className="font-medium text-gray-700 mb-2">
                  KM Went
                </label>
                <input
                  type="text"
                  name="KM_Went"
                  value={formData.KM_Went || ""}
                  onChange={handleChange}
                  className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* KM For */}
              <div className="flex flex-col bg-blue-50 p-4 rounded-lg shadow-md">
                <label className="font-medium text-gray-700 mb-2">KM For</label>
                <input
                  type="text"
                  name="KM_For"
                  value={formData.KM_For || ""}
                  onChange={handleChange}
                  className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* UPI */}
              <div className="flex flex-col bg-blue-50 p-4 rounded-lg shadow-md">
                <label className="font-medium text-gray-700 mb-2">UPI</label>
                <input
                  type="text"
                  name="upi"
                  value={formData.upi || ""}
                  onChange={handleChange}
                  className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Cash */}
              <div className="flex flex-col bg-blue-50 p-4 rounded-lg shadow-md">
                <label className="font-medium text-gray-700 mb-2">Cash</label>
                <input
                  type="text"
                  name="cash"
                  value={formData.cash || ""}
                  onChange={handleChange}
                  className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Cheque */}
              <div className="flex flex-col bg-blue-50 p-4 rounded-lg shadow-md">
                <label className="font-medium text-gray-700 mb-2">Cheque</label>
                <input
                  type="text"
                  name="cheque"
                  value={formData.cheque || ""}
                  onChange={handleChange}
                  className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* UPI Method */}
              <div className="flex flex-col bg-blue-50 p-4 rounded-lg shadow-md">
                <label className="font-medium text-gray-700 mb-2">
                  UPI Method
                </label>
                <input
                  type="text"
                  name="UPIMethod"
                  value={formData.UPIMethod || ""}
                  onChange={handleChange}
                  className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Advance Pay */}
              <div className="flex flex-col bg-blue-50 p-4 rounded-lg shadow-md">
                <label className="font-medium text-gray-700 mb-2">
                  Advance Pay
                </label>
                <input
                  type="text"
                  name="AdvancePay"
                  value={formData.AdvancePay || ""}
                  onChange={handleChange}
                  className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Advance Pay UPI */}
              <div className="flex flex-col bg-blue-50 p-4 rounded-lg shadow-md">
                <label className="font-medium text-gray-700 mb-2">
                  Advance Pay UPI
                </label>
                <input
                  type="text"
                  name="AdvancePayUPI"
                  value={formData.AdvancePayUPI || ""}
                  onChange={handleChange}
                  className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Advance Pay Cash */}
              <div className="flex flex-col bg-blue-50 p-4 rounded-lg shadow-md">
                <label className="font-medium text-gray-700 mb-2">
                  Advance Pay Cash
                </label>
                <input
                  type="text"
                  name="AdvancePayCash"
                  value={formData.AdvancePayCash || ""}
                  onChange={handleChange}
                  className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Damage Pay */}
              <div className="flex flex-col bg-blue-50 p-4 rounded-lg shadow-md">
                <label className="font-medium text-gray-700 mb-2">
                  Damage Pay
                </label>
                <input
                  type="text"
                  name="DamagePay"
                  value={formData.DamagePay || ""}
                  onChange={handleChange}
                  className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Amount */}
              <div className="flex flex-col bg-blue-50 p-4 rounded-lg shadow-md">
                <label className="font-medium text-gray-700 mb-2">Amount</label>
                <input
                  type="text"
                  name="Amount"
                  value={formData.Amount || ""}
                  onChange={handleChange}
                  className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Return Date */}
              <div className="flex flex-col bg-blue-50 p-4 rounded-lg shadow-md">
                <label className="font-medium text-gray-700 mb-2">
                  Return Date
                </label>
                <input
                  type="date"
                  name="return_date"
                  value={formData.return_date?.substring(0, 10) || ""}
                  onChange={handleChange}
                  className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Discount */}
              <div className="flex flex-col bg-blue-50 p-4 rounded-lg shadow-md">
                <label className="font-medium text-gray-700 mb-2">
                  Discount
                </label>
                <input
                  type="text"
                  name="Discount"
                  value={formData.Discount || ""}
                  onChange={handleChange}
                  className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Tip */}
              <div className="flex flex-col bg-blue-50 p-4 rounded-lg shadow-md">
                <label className="font-medium text-gray-700 mb-2">Tip</label>
                <input
                  type="text"
                  name="Tip"
                  value={formData.Tip || ""}
                  onChange={handleChange}
                  className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Personal Use */}
              <div className="flex flex-col bg-blue-50 p-4 rounded-lg shadow-md">
                <label className="font-medium text-gray-700 mb-2">
                  Personal Use
                </label>
                <input
                  type="checkbox"
                  name="Persnal_use"
                  checked={formData.Persnal_use || false}
                  onChange={(e) =>
                    handleChange({
                      target: { name: "Persnal_use", value: e.target.checked },
                    })
                  }
                  className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Add other fields similarly */}
              <div className="col-span-full flex justify-end mt-6">
                <button
                  onClick={handleSave}
                  className="bg-yellow-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center space-x-2"
                >
                  <FaSave />
                  <span>Save</span>
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="ml-3 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg flex items-center space-x-2"
                >
                  <FaTimes />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col bg-yellow-500 p-4 hover:bg-blue-200 rounded-lg shadow-md">
                <label className="font-medium text-gray-700 mb-2">ID</label>
                <p className="text-lg text-gray-900">{rentalData.id}</p>
              </div>
              <div className="flex flex-col bg-yellow-500 p-4 hover:bg-blue-200 rounded-lg shadow-md">
                <label className="font-medium text-gray-700 mb-2">
                  Rental Date
                </label>
                <p className="text-lg text-gray-900">
                  {new Date(rentalData.rental_date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-col bg-yellow-500 p-4 hover:bg-blue-200 rounded-lg shadow-md">
                <label className="font-medium text-gray-700 mb-2">
                  Time Thought
                </label>
                <p className="text-lg text-gray-900">
                  {rentalData.TimeThought}
                </p>
              </div>
              <div className="flex flex-col bg-yellow-500 p-4 hover:bg-blue-200 rounded-lg shadow-md">
                <label className="font-medium text-gray-700 mb-2">
                  KM Went
                </label>
                <p className="text-lg text-gray-900">
                  {rentalData.KM_Went ?? "N/A"}
                </p>
              </div>
              <div className="flex flex-col bg-yellow-500 p-4 hover:bg-blue-200 rounded-lg shadow-md">
                <label className="font-medium text-gray-700 mb-2">KM For</label>
                <p className="text-lg text-gray-900">
                  {rentalData.KM_For ?? "N/A"}
                </p>
              </div>
              <div className="flex flex-col bg-yellow-500 p-4 hover:bg-blue-200 rounded-lg shadow-md">
                <label className="font-medium text-gray-700 mb-2">UPI:</label>
                <p className="text-lg text-gray-900">
                  {rentalData.upi ?? "N/A"}
                </p>
              </div>
              <div className="flex flex-col bg-yellow-500 p-4 hover:bg-blue-200 rounded-lg shadow-md">
                <label className="font-medium text-gray-700 mb-2">Cash</label>
                <p className="text-lg text-gray-900">
                  {rentalData.cash ?? "N/A"}
                </p>
              </div>{" "}
              <div className="flex flex-col bg-yellow-500 p-4 hover:bg-blue-200 rounded-lg shadow-md">
                <label className="font-medium text-gray-700 mb-2">
                  Checque
                </label>
                <p className="text-lg text-gray-900">
                  {rentalData.cheque ?? "N/A"}
                </p>
              </div>{" "}
              <div className="flex flex-col bg-yellow-500 p-4 hover:bg-blue-200 rounded-lg shadow-md">
                <label className="font-medium text-gray-700 mb-2">
                  UPI Method
                </label>
                <p className="text-lg text-gray-900">
                  {rentalData.UPIMethod ?? "N/A"}
                </p>
              </div>{" "}
              <div className="flex flex-col bg-yellow-500 p-4 hover:bg-blue-200 rounded-lg shadow-md">
                <label className="font-medium text-gray-700 mb-2">
                  Advance Pay
                </label>
                <p className="text-lg text-gray-900">
                  {rentalData.AdvancePay ?? "N/A"}
                </p>
              </div>{" "}
              <div className="flex flex-col bg-yellow-500 p-4 hover:bg-blue-200 rounded-lg shadow-md">
                <label className="font-medium text-gray-700 mb-2">
                  Advance Pay UPI
                </label>
                <p className="text-lg text-gray-900">
                  {rentalData.AdvancePayUPI ?? "N/A"}
                </p>
              </div>{" "}
              <div className="flex flex-col bg-yellow-500 p-4 hover:bg-blue-200 rounded-lg shadow-md">
                <label className="font-medium text-gray-700 mb-2">
                  Advance Pay Cash
                </label>
                <p className="text-lg text-gray-900">
                  {rentalData.AdvancePayCash ?? "N/A"}
                </p>
              </div>{" "}
              <div className="flex flex-col bg-yellow-500 p-4 hover:bg-blue-200 rounded-lg shadow-md">
                <label className="font-medium text-gray-700 mb-2">
                  Damage Pay
                </label>
                <p className="text-lg text-gray-900">
                  {rentalData.DamagePay ?? "N/A"}
                </p>
              </div>{" "}
              <div className="flex flex-col bg-yellow-500 p-4 hover:bg-blue-200 rounded-lg shadow-md">
                <label className="font-medium text-gray-700 mb-2">Amount</label>
                <p className="text-lg text-gray-900">
                  {rentalData.Amount ?? "N/A"}
                </p>
              </div>{" "}
              <div className="flex flex-col bg-yellow-500 p-4 hover:bg-blue-200 rounded-lg shadow-md">
                <label className="font-medium text-gray-700 mb-2">
                  Return Date
                </label>
                <p className="text-lg text-gray-900">
                  {rentalData.return_date
                    ? new Date(rentalData.return_date).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>{" "}
              <div className="flex flex-col bg-yellow-500 p-4 hover:bg-blue-200 rounded-lg shadow-md">
                <label className="font-medium text-gray-700 mb-2">
                  Discount
                </label>
                <p className="text-lg text-gray-900">
                  {rentalData.Discount ?? "N/A"}
                </p>
              </div>{" "}
              <div className="flex flex-col bg-yellow-500 p-4 hover:bg-blue-200 rounded-lg shadow-md">
                <label className="font-medium text-gray-700 mb-2">Tip</label>
                <p className="text-lg text-gray-900">
                  {rentalData.Tip ?? "N/A"}
                </p>
              </div>{" "}
              <div className="flex flex-col bg-yellow-500 p-4 hover:bg-blue-200 rounded-lg shadow-md">
                <label className="font-medium text-gray-700 mb-2">
                  Personal Use
                </label>
                <p className="text-lg text-gray-900">
                  {rentalData.Persnal_use ? "Yes" : "No"}
                </p>
              </div>
              <div
                onDoubleClick={() =>
                  navigate(`/Customer/${rentalData.user.phone}`, {
                    state: {
                      Data: { phone: rentalData.user.phone },
                      Amount: 0,
                      r_id: "Null",
                    },
                  })
                }
                className="flex flex-col bg-yellow-500 p-4 hover:bg-blue-200 rounded-lg shadow-md"
              >
                <label className="font-medium text-gray-700 mb-2">User</label>
                <p className="text-lg text-gray-900">
                  {rentalData.user.name ?? "N/A"}
                </p>
              </div>{" "}
              <div className="flex flex-col bg-yellow-500 p-4 hover:bg-blue-200 rounded-lg shadow-md">
                <label className="font-medium text-gray-700 mb-2">Bike</label>
                <p className="text-lg text-gray-900">
                  {rentalData.bike.b_id ?? "N/A"}
                </p>
              </div>
              {/* Add other fields similarly */}
              <div className="col-span-full flex justify-end mt-6">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-yellow-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center space-x-2"
                >
                  <FaEdit />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
};

export default Rental;
