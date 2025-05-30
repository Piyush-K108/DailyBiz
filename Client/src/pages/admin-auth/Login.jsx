import React, { useState, useEffect } from "react";
import "./Login.css"; // Import your CSS file for styling
import adminIcon from "../../assets/admin-icon.png";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector, connect } from "react-redux";
import {
  checkAuthenticated,
  login,
} from "../../Redux/Counter/counterAction.jsx";
import { colors } from "@mui/material";
const Login = ({ login, checkAuthenticated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    phonenumber: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [validationData, setValidationData] = useState({});
  const isAuthenticated = useSelector((state) => state.counter.isAuthenticated);
  checkAuthenticated();
  const token = localStorage.getItem("access");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //  useEffect(() => {
  //   if (token) {
  //     setIsLoading(true);
  //     setTimeout(() => {
  //       setIsLoading(false);
  //       setValidationData("");
  // navigate("/revenue");
  //     }, 3000);
  //   }
  // }, [token, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.phonenumber.trim()) {
      errors.phonenumber = "Phonenumber is required";
    }
    if (!formData.password.trim()) {
      errors.password = "Password is required";
    }
    return errors;
  };

  const validateData = () => {
    const errors = {};

    errors.Error = "Credentials is Incorrect";

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setValidationErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsLoading(true); // Show the loading animation after the form is submitted.

    try {
      await login(formData.phonenumber, formData.password);
      const DataErrors = validateData();
      setValidationData(DataErrors);
      setIsLoading(false); // Hide the loading animation in case of an error.
    } catch (error) {
      const DataErrors = validateData();
      setValidationData(DataErrors);
      setIsLoading(false); // Hide the loading animation in case of an error.
    }
  };

  return (
    <div className="login-container">
      <div className="imgAndHead">
        <img src={adminIcon} height={100} width={102} alt="Admin-icon" />
        <h2 className="login-heading">AIRYY ADMIN</h2>
      </div>
      <div className="login-box">
        {isLoading ? (
          <div className="loading-animation">
            {/* Add your loading animation here */}
            <p className="loading-text">Loading...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {validationData.Error && (
              <div style={{ color: "red", fontWeight: "bold" }}>
                {validationData.Error}
              </div>
            )}
            <h2>Login</h2>
            <div className="form-group">
              <label htmlFor="phonenumber" className="font-bold mb-1">
                Phone No.
              </label>
              <input
                type="tel"
                id="phonenumber"
                name="phonenumber"
                value={formData.phonenumber}
                onChange={handleInputChange}
                required
                className="IntTxt"
              />
              {validationErrors.phonenumber && (
                <div className="error">{validationErrors.phonenumber}</div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="password" className="font-bold mb-1">
                Password
              </label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  className="InpPassword"
                  onChange={handleInputChange}
                  required
                />

                <div className="password-toggle" onClick={handleTogglePassword}>
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </div>
              </div>
              {validationErrors.password && (
                <div className="error">{validationErrors.password}</div>
              )}
            </div>

            <button
              className="bg-yellow-400 text-black font-semibold text-base w-full p-2 rounded"
              type="submit"
            >
              Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.isAuthenticated,
  };
};

export default connect(mapStateToProps, { login, checkAuthenticated })(Login);
