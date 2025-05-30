import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputLabel,
  Input,
  Box,
} from "@mui/material";

const UploadModal = ({ bikeId, isOpen, onClose, onUpload, car }) => {
  const [files, setFiles] = useState({
    Bill: null,
    RC_card: null,
    Insurance: null,
    Purchase_date: "",
    Amount: "",
    Traking_app: "",
  });

  const handleFileChange = (e) => {
    const { name, value, files: selectedFiles } = e.target;
    if (selectedFiles) {
      setFiles((prev) => ({ ...prev, [name]: selectedFiles[0] }));
    } else {
      setFiles((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpload = () => {
    const formData = new FormData();
    if (car) {
      formData.append("Car", bikeId);
    } else {
      formData.append("bike", bikeId);
    }
    if (files.Bill) formData.append("Bill", files.Bill);
    if (files.RC_card) formData.append("RC_card", files.RC_card);
    if (files.Insurance) formData.append("Insurance", files.Insurance);
    formData.append("Purchase_date", files.Purchase_date);
    formData.append("Amount", files.Amount);
    formData.append("Traking_app", files.Traking_app);

    onUpload(formData);
  };

  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "16px", // Rounded corners
          padding: "16px", // Inner padding
          backgroundColor: "#f5f5f5", // Custom background color
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)", // Custom shadow
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          color: "#333", // Custom text color
         fontFamily:'poppins', // Center align title
          padding: "8px 16px",
          marginBottom:'16px' // Custom padding
        }}
      >
        Upload Documents.
      </DialogTitle>
      <DialogContent>
        <Box component="form" noValidate autoComplete="off">
          <Box mb={3}>
            <InputLabel htmlFor="Bill">Bill:</InputLabel>
            <Input
              type="file"
              name="Bill"
              id="Bill"
              onChange={handleFileChange}
              fullWidth
            />
          </Box>
          <Box mb={3}>
            <InputLabel htmlFor="RC_card">RC Card:</InputLabel>
            <Input
              type="file"
              name="RC_card"
              id="RC_card"
              onChange={handleFileChange}
              fullWidth
            />
          </Box>
          <Box mb={3}>
            <InputLabel htmlFor="Insurance">Insurance:</InputLabel>
            <Input
              type="file"
              name="Insurance"
              id="Insurance"
              onChange={handleFileChange}
              fullWidth
            />
          </Box>
          <Box mb={3}>
            <TextField
              type="date"
              name="Purchase_date"
              id="Purchase_date"
              label="Purchase Date"
              onChange={handleFileChange}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
          </Box>
          <Box mb={3}>
            <TextField
              type="text"
              name="Traking_app"
              id="Traking_app"
              label="Traking App"
              onChange={handleFileChange}
              fullWidth
            />
          </Box>
          <Box mb={3}>
            <TextField
              type="text"
              name="Amount"
              id="Amount"
              label="Amount"
              onChange={handleFileChange}
              fullWidth
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{
            border: "1px solid #e5e7eb", // Custom red color for Cancel
            color: "#dc2626",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#fee2e2", // Darker red on hover
            },
            padding: "4px 8px",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          sx={{
            backgroundColor: "#fbbf24",
            color: "#000",
            "&:hover": {
              backgroundColor: "#fde68a",
            },
            padding: "4px 8px",
          }}
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadModal;
