import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Grid,
  Box,
  Divider,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import Bike from "../../assets/Bike.jpg";
import useCheckAccess from "../CheckAccess";
import { API_URL } from "../../config";

const BikeItem2 = ({ item, onDelete, hasRevenueAccess, delivery }) => {
  const navigate = useNavigate();
  const hasAccess = useCheckAccess();
  const [statistics, setStatistics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(
      `http://${API_URL}/Admin/bike-statistics/${
        delivery ? item.license_plate : item.b_id
      }/`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        return res.json();
      })
      .then((data) => {
        if (data && data["Total Earned"] !== undefined) {
          setStatistics(data);
        } else {
          throw new Error("No valid data available");
        }
      })
      .catch((err) => setError(err.message));
  }, [delivery ? item.license_plate : item.b_id]);

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card className="shadow-lg transition-transform hover:scale-105">
        <CardMedia
          component="img"
          height="180"
          image={Bike}
          alt={`Bike ${delivery ? item.license_plate : item.b_id}`}
          onDoubleClick={() =>
            navigate(
              `/bikestatistics/${delivery ? item.license_plate : item.b_id}/`,
              {
                state: {
                  bikeId: delivery ? item.license_plate : item.b_id,
                  hasRevenueAccess: hasRevenueAccess,
                },
              }
            )
          }
        />
        <CardContent>
          {/* Bike Status & License Plate */}
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Box
              className={`rounded-full h-3 w-3 ${
                item.is_assigned
                  ? "bg-red-500"
                  : !item.Condition
                  ? "bg-orange-400"
                  : "bg-green-500"
              }`}
            />
            <Typography variant="h6" fontWeight="bold">
              {item.license_plate}{" "}
              {item.Helmet && <span className="text-yellow-500">🪖</span>}
            </Typography>
          </Box>

          {/* Bike Info */}
          <Box mb={2}>
            <Typography variant="body2" color="textSecondary">
              <strong>License Plate:</strong>{" "}
              {delivery ? item.license_plate : item.b_id}
            </Typography>
            {!delivery && (
              <Typography variant="body2" color="textSecondary">
                <strong>KM Now:</strong> {item.KM_Now}
              </Typography>
            )}
          </Box>

          {/* Error Handling or Statistics */}
          {error ? (
            <Typography variant="body2" color="error" textAlign="center">
              {error}
            </Typography>
          ) : statistics && hasRevenueAccess ? (
            <Box
              p={2}
              mt={1}
              border="1px solid #ddd"
              borderRadius={2}
              bgcolor="#f9f9f9"
              display="flex"
              flexDirection="column"
              gap={1}
            >
              <Typography variant="body2" fontWeight="bold" textAlign="start">
                📊 Bike Statistics
              </Typography>
              <Divider />
              <Typography variant="body2">
                <strong>Total Earned:</strong> ₹
                {statistics["Total Earned"] ?? "None"}
              </Typography>
              <Typography variant="body2">
                <strong>Total Spent:</strong> ₹
                {statistics["Total Spent "] ?? "None"}
              </Typography>
            </Box>
          ) : (
            <Typography
              variant="body2"
              color="textSecondary"
              textAlign="center"
            >
              Loading...
            </Typography>
          )}

          {/* Action Buttons */}

          <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
            <IconButton
              color="primary"
              onClick={() =>
                navigate(
                  delivery
                    ? `/editdeliveryBike/${delivery ? item.license_plate : item.b_id}`
                    : `/editBike/${delivery ? item.license_plate : item.b_id}`
                )
              }
            >
              <EditIcon />
            </IconButton>
            <IconButton
              color="error"
              onClick={() =>
                onDelete(delivery ? item.license_plate : item.b_id)
              }
            >
              <DeleteForeverIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default BikeItem2;
