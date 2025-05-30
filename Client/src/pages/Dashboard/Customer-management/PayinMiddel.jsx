import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../config";
const PayinMiddel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { r_id } = location.state;

  const [formData, setFormData] = useState({
    r_id: r_id,
    date: "",
    amount: "",
    upi: 0,
    cash: 0,
    cheque: 0,
    reason: "",
    UPIMethod: "QR Code",
  });
  const [paymentMethods, setPaymentMethods] = useState({
    upiChecked: false,
    cashChecked: false,
    chequeChecked: false,
  });
  const [errors, setErrors] = useState("");
  const [rids, setRids] = useState([]);
  useEffect(() => {
    const fetchRids = async () => {
      try {
        const response = await axios.get(
          `http://${API_URL}/Admin/Rids/${location.state.phone}/`
        ); // Fetch r_id's using the phone number
        setRids(response.data.data.rental_ids);
      } catch (error) {
        console.error("Error fetching r_id's:", error);
      }
    };

    fetchRids(); // Call the function inside useEffect
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (method) => {
    setPaymentMethods({
      ...paymentMethods,
      [`${method}Checked`]: !paymentMethods[`${method}Checked`],
    });
    // Reset the corresponding amount to 0 when checkbox is unchecked
    if (paymentMethods[`${method}Checked`]) {
      setFormData({ ...formData, [method]: 0 });
    }
  };

  const validateAmounts = () => {
    const totalAmount = parseFloat(formData.amount);
    const totalEntered =
      parseFloat(formData.cash || 0) +
      parseFloat(formData.upi || 0) +
      parseFloat(formData.cheque || 0);

    if (totalEntered !== totalAmount) {
      setErrors("Total amount does not match the sum of the payment methods.");
      return false;
    }
    setErrors("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAmounts()) return;
    const response = await fetch(`http://${API_URL}/Admin/deposite/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      alert("Deposit submitted successfully!");
      navigate(-2);
    } else {
      alert("Error submitting deposit");
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Submit Deposit
      </h1>
      <form onSubmit={handleSubmit}>
        {r_id == "Null" ? (
          <div className="mb-6">
            <label className="block text-xl font-semibold text-gray-700">
              Rental ID:
            </label>
            <select
              name="r_id"
              value={formData.r_id}
              onChange={handleChange}
              className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-lg p-2"
              required
            >
              <option value="" disabled>
                Select Rental ID
              </option>
              {rids?.map((rid) => (
                <option key={rid} value={rid}>
                  {rid}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <label className="text-xl font-semibold text-gray-700">
                Rental ID:
              </label>
              <span className="text-lg text-gray-600 bg-gray-100 py-2 px-4 rounded-md">
                {r_id}
              </span>
            </div>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-xl font-semibold text-gray-700">
            Date:
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-lg p-2"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-xl font-semibold text-gray-700">
            Total Amount:
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-lg p-2"
            placeholder="Enter Total Amount"
            required
          />
        </div>

        {/* Payment Methods */}
        <div className="mb-6">
          <label className="block text-xl font-semibold text-gray-700">
            Payment Methods:
          </label>
          <div className="mt-3 space-y-3">
            {/* UPI */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="upi"
                checked={paymentMethods.upiChecked}
                onChange={() => handleCheckboxChange("upi")}
                className="appearance-none h-5 w-5 border border-gray-300 rounded-md checked:bg-yellow-500 checked:ring-yellow-500 checked:ring-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <label className="ml-3 text-lg text-gray-700">UPI</label>
              {paymentMethods.upiChecked && (
                <input
                  type="number"
                  name="upi"
                  value={formData.upi}
                  onChange={(e) => handleChange(e)}
                  className="ml-3 block w-32 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-lg p-2"
                  placeholder="UPI Amount"
                />
              )}
            </div>

            {/* Cash */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="cash"
                checked={paymentMethods.cashChecked}
                onChange={() => handleCheckboxChange("cash")}
                className="appearance-none h-5 w-5 border border-gray-300 rounded-md checked:bg-yellow-500 checked:ring-yellow-500 checked:ring-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <label className="ml-3 text-lg text-gray-700">Cash</label>
              {paymentMethods.cashChecked && (
                <input
                  type="number"
                  name="cash"
                  value={formData.cash}
                  onChange={(e) => handleChange(e)}
                  className="ml-3 block w-32 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-lg p-2"
                  placeholder="Cash Amount"
                />
              )}
            </div>

            {/* Cheque */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="cheque"
                checked={paymentMethods.chequeChecked}
                onChange={() => handleCheckboxChange("cheque")}
                className="appearance-none h-5 w-5 border border-gray-300 rounded-md checked:bg-yellow-500 checked:ring-yellow-500 checked:ring-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <label className="ml-3 text-lg text-gray-700">Cheque</label>
              {paymentMethods.chequeChecked && (
                <input
                  type="number"
                  name="cheque"
                  value={formData.cheque}
                  onChange={(e) => handleChange(e)}
                  className="ml-3 block w-32 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-lg p-2"
                  placeholder="Cheque Amount"
                />
              )}
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-xl font-semibold text-gray-700">
              Reason:
            </label>
            <input
              type="text"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-lg p-2"
              placeholder="Enter reason for deposit"
              required
            />
          </div>
        </div>

        {/* Error Message */}
        {errors && <div className="text-red-600 mb-4">{errors}</div>}

        <button
          type="submit"
          className="w-full bg-yellow-500 text-white text-lg py-3 px-4 rounded-md hover:bg-yellow-600 focus:outline-none transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default PayinMiddel;
