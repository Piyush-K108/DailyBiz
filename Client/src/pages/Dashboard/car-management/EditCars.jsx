import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import { API_URL } from "../../../config";
import { Upload } from "@mui/icons-material";
import UploadModal from "../Mybike/UploadModal";

const EditCars = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setModalOpen] = useState(false);

  const { image } = location.state;
  const [Image, setImage] = useState(() => {
    return localStorage.getItem("currentImage") || image;
  });
  useEffect(() => {
    if (Image) {
      localStorage.setItem("currentImage", Image);
    }
  }, [Image]);

  useEffect(() => {
    return () => {
      localStorage.removeItem("currentImage");
    };
  }, []);
  const [formData, setFormData] = useState({
    modelName: "",
    modelYear: "",
    Colour: "",
    fuelType: "",
    ownerName: "",
    purchasePrice: "",
    sellPrice: "",
    ratePerHour: "",
    KM_Previous: "",
    KM_Now: "",
    Condition: false,
    license_plate: "",
    Estimated_Amount: "",
    Exact_Amount: "",
    is_assigned: false,
    is_attached: false,
    Total_Earned: "",
    Total_Spend: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await fetch(`http://${API_URL}/Car/car-info/${id}/`);
        if (response.ok) {
          const carData = await response.json();
          setFormData(carData);
        } else {
          console.error("Failed to fetch car details");
        }
      } catch (error) {
        console.error("Error fetching car details:", error);
      }
    };

    fetchCarDetails();
  }, [id]);

  const handleUploadDocuments = (formData) => {
    for (var pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
    fetch(`http://${API_URL}/Admin/car-doc/`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        window.alert("Documents uploaded successfully!");
        // setModalOpen(false);
      })
      .catch((error) => {
        console.error("Error uploading documents:", error);
        window.alert("Failed to upload documents.");
      });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("Image", file);

    try {
      const response = await fetch(`http://${API_URL}/Car/Car_Profile/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Image upload failed!");
      }

      const data = await response.json();
      console.log("Upload successful:", data);
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image.");
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      handleImageUpload(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const uploadData = new FormData();
    for (const key in formData) {
      uploadData.append(key, formData[key]);
    }

    try {
      const response = await fetch(`http://${API_URL}/Car/car-info/${id}`, {
        method: "PUT",
        body: uploadData,
      });

      const result = await response.json();
      if (response.ok) {
        alert("Car updated successfully!");
        navigate("/cars");
      } else {
        console.error("Failed to update car:", result);
        alert(`Failed to update car: ${result.message || "Please try again."}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-[60px] p-[50px] lg:ml-[180px] max-w-[800px] w-full">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center">
            <div className="">
              {Image ? (
                <div className="flex flex-col mb-6 items-center">
                  <img
                    src={Image}
                    alt="Car"
                    title="upload new image"
                    className="w-[70px] h-[70px] object-cover rounded-[18px] mr-4 cursor-pointer "
                    onClick={() =>
                      document.getElementById("imageUpload").click()
                    }
                  />
                  {/* <p className="text-[15px]">Car Image</p> */}
                </div>
              ) : (
                <button
                  onClick={() => document.getElementById("imageUpload").click()}
                  className="bg-gray-200 w-[80px] h-[60px] flex items-center justify-center rounded-lg cursor-pointer"
                >
                  Upload Image
                </button>
              )}
              <input
                id="imageUpload"
                name="Image"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            <h2 className="text-2xl  font-poppins tracking-wide text-center text-black mb-6">
              Edit Car Details
            </h2>
          </div>

          <button
            className="bg-black text-yellow-400 px-4 py-2 rounded "
            onClick={() => setModalOpen(true)}
            title="upload Document"
          >
            {" "}
            <Upload className="font-light cursor-pointer" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="Model Name"
              name="modelName"
              variant="outlined"
              required
              value={formData.modelName}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Model Year"
              name="modelYear"
              type="number"
              variant="outlined"
              required
              value={formData.modelYear}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Colour"
              name="Colour"
              variant="outlined"
              required
              value={formData.Colour}
              onChange={handleChange}
            />

            <FormControl fullWidth variant="outlined" required>
              <InputLabel>Fuel Type</InputLabel>
              <Select
                label="Fuel Type"
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
              >
                <MenuItem value="CNG">CNG</MenuItem>
                <MenuItem value="Petrol">Petrol</MenuItem>
                <MenuItem value="Diesel">Diesel</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Owner Name"
              name="ownerName"
              variant="outlined"
              required
              value={formData.ownerName}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Purchase Price"
              name="purchasePrice"
              type="number"
              variant="outlined"
              required
              value={formData.purchasePrice}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Sell Price"
              name="sellPrice"
              type="number"
              variant="outlined"
              required
              value={formData.sellPrice}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Rate per Hour"
              name="ratePerHour"
              type="number"
              variant="outlined"
              required
              value={formData.ratePerHour}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="KM Previous"
              name="KM_Previous"
              type="number"
              variant="outlined"
              required
              value={formData.KM_Previous}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="KM Now"
              name="KM_Now"
              type="number"
              variant="outlined"
              required
              value={formData.KM_Now}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="License Plate"
              name="license_plate"
              variant="outlined"
              required
              value={formData.license_plate}
              onChange={handleChange}
            />

            {/* here I want to show Image that is  */}

            <TextField
              fullWidth
              label="Estimated Amount"
              name="Estimated_Amount"
              type="number"
              variant="outlined"
              required
              value={formData.Estimated_Amount}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Exact Amount"
              name="Exact_Amount"
              type="number"
              variant="outlined"
              required
              value={formData.Exact_Amount}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Total Spend"
              name="Total_Spend"
              type="number"
              variant="outlined"
              value={formData.Total_Spend}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Total Earned"
              name="Total_Earned"
              type="number"
              variant="outlined"
              value={formData.Total_Earned}
              onChange={handleChange}
            />

            <FormControl fullWidth>
              <InputLabel>Is Attached</InputLabel>
              <Checkbox
                name="is_attached"
                checked={formData.is_attached}
                onChange={handleChange}
                color="primary"
              />
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Is Assigned</InputLabel>
              <Checkbox
                name="is_assigned"
                checked={formData.is_assigned}
                onChange={handleChange}
                color="primary"
              />
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Condition</InputLabel>
              <Checkbox
                name="Condition"
                checked={formData.Condition}
                onChange={handleChange}
                color="primary"
              />
            </FormControl>
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-black text-yellow-400 py-2 rounded hover:bg-gray-800 transition"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Update Car"
            )}
          </button>
        </form>
        <UploadModal
          bikeId={id}
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onUpload={handleUploadDocuments}
          car={true}
        />
      </div>
    </div>
  );
};

export default EditCars;
