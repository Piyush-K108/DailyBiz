import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import FormControlLabel from "@mui/material/FormControlLabel"; 
import {API_URL} from "../../../config/index"
 const AddCars = () => {
   // State to handle form inputs
     const navigate = useNavigate();
      const [loading, setLoading] = useState(false);
     const [carData, setCarData] = useState({
       carid: "",
       Colour: "",
       modelName: "",
       modelYear: "",
       fuelType: "",
       ownerName: "",
       purchasePrice: "",
       sellPrice: "",
       ratePerHour: "",
       KM_Previous: "",
       KM_Now: "",
       Condition: false,
       license_plate: "",
       Image: null,
       Pic_after: null,
       Pic_before: null,
       Estimated_Amount: "0", // default value
       Exact_Amount: "0", // default value
       is_assigned: false, // default value
       is_attached: false, // default value
       Total_Earned: "0", // default value
       Total_Spend: "0", // default value
     
     });

     const handleChange = (e) => {
       const { name, value, type, checked, files } = e.target;
       if (type === "file") {
         setCarData((prevData) => ({
           ...prevData,
           [name]: files[0], // Store the selected file in state
         }));
       } else {
         setCarData((prevData) => ({
           ...prevData,
           [name]: type === "checkbox" ? checked : value,
         }));
       }
     };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading spinner

    const formData = new FormData();
    for (const key in carData) {
      formData.append(key, carData[key] || ""); // append empty strings for missing values
    }

    try {
      const response = await fetch(`http://${API_URL}/Car/car-info/`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Car added successfully!");
        navigate("/cars"); // Navigate to /cars path after success
      } else {
        const errorDetails = await response.json();
        console.error("API responded with error:", errorDetails);
        alert(
          "Failed to add car. Error details: " + JSON.stringify(errorDetails)
        );
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        "An error occurred. Please check your network connection and try again."
      );
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };
   return (
     <div className="min-h-screen flex items-center justify-center p-4">
       <form
         onSubmit={handleSubmit}
         className="bg-white shadow-lg rounded-[60px] p-[50px] lg:ml-[180px] max-w-[800px] w-full "
       >
         <h2 className="text-2xl font-bold font-poppins tracking-wide text-center text-black mb-6">
           Add New Car
         </h2>

         {/* Grid layout for input fields */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <TextField
             fullWidth
             label="Model Name"
             name="modelName"
             variant="outlined"
             required
             value={carData.modelName}
             onChange={handleChange}
           />
           <TextField
             fullWidth
             label="Car id"
             name="carid"
             variant="outlined"
             required
             value={carData.carid}
             onChange={handleChange}
           />
           <TextField
             fullWidth
             label="License plate No."
             name="license_plate"
             variant="outlined"
             required
             value={carData.license_plate}
             onChange={handleChange}
           />

           <TextField
             fullWidth
             label="Model Year"
             name="modelYear"
             type="number"
             variant="outlined"
             required
             value={carData.modelYear}
             onChange={handleChange}
           />

           <TextField
             fullWidth
             label="Color"
             name="Colour"
             variant="outlined"
             required
             value={carData.color}
             onChange={handleChange}
           />
           <TextField
             fullWidth
             label="KM Previous"
             name="KM_Previous"
             variant="outlined"
             required
             value={carData.KM_Previous}
             onChange={handleChange}
           />
           <TextField
             fullWidth
             label="KM Now"
             name="KM_Now"
             variant="outlined"
             required
             value={carData.KM_Now}
             onChange={handleChange}
           />

           {/* Fuel Type Dropdown */}
           <FormControl fullWidth variant="outlined" required>
             <InputLabel>Fuel Type</InputLabel>
             <Select
               label="Fuel Type"
               name="fuelType"
               value={carData.fuelType}
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
             value={carData.ownerName}
             onChange={handleChange}
           />

           <TextField
             fullWidth
             label="Purchase Price"
             name="purchasePrice"
             type="number"
             variant="outlined"
             required
             value={carData.purchasePrice}
             onChange={handleChange}
           />

           <TextField
             fullWidth
             label="Sell Price"
             name="sellPrice"
             type="number"
             variant="outlined"
             required
             value={carData.sellPrice}
             onChange={handleChange}
           />

           <TextField
             fullWidth
             label="Rate per Hour"
             name="ratePerHour"
             type="number"
             variant="outlined"
             required
             value={carData.ratePerHour}
             onChange={handleChange}
           />

           <div className="col-span-2">
             <label className="block text-gray-700 text-sm font-bold mb-2">
               Car Image
             </label>
             <input
               type="file"
               name="Image"
               accept="image/*"
               onChange={handleChange}
               className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
             />
           </div>

           <div className="flex flex-col space-y-2">
             <label className="text-black">Availability</label>
             <div className="flex flex-wrap gap-2">
               <label className="flex items-center text-black">
                 <input
                   type="radio"
                   name="availability"
                   value="12 hours"
                   checked={carData.availability === "12 hours"}
                   onChange={handleChange}
                   className="mr-2 appearance-none w-4 h-4 border-2 border-gray-400 rounded-full checked:bg-yellow-400 checked:border-black"
                 />
                 12 hours
               </label>
               <label className="flex items-center text-black">
                 <input
                   type="radio"
                   name="availability"
                   value="24 hours"
                   checked={carData.availability === "24 hours"}
                   onChange={handleChange}
                   className="mr-2 appearance-none w-4 h-4 border-2 border-gray-400 rounded-full checked:bg-yellow-400 checked:border-black"
                 />
                 24 hours
               </label>
               <label className="flex items-center text-black">
                 <input
                   type="radio"
                   name="availability"
                   value="Hourly Basis"
                   checked={carData.availability === "Hourly Basis"}
                   onChange={handleChange}
                   className="mr-2 appearance-none w-4 h-4 border-gray-400 border-2 rounded-full checked:bg-yellow-400 checked:border-black"
                 />
                 Hourly Basis
               </label>
             </div>
             <FormControlLabel
               control={
                 <Checkbox
                   checked={carData.is_attached}
                   onChange={handleChange}
                   name="is_attached"
                   color="primary"
                 />
               }
               label="Is Attached"
             />
           </div>
         </div>

         <button
           type="submit"
           className="mt-6 w-full bg-black text-yellow-400 py-2 rounded hover:bg-gray-800 transition"
         >
           {loading ? <CircularProgress size={24} /> : "Add Car"}
         </button>
       </form>
     </div>
   );
 };

export default AddCars;