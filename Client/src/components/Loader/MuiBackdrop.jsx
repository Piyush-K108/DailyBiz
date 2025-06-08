import React from "react";
import Backdrop from "@mui/material/Backdrop";
import Loader from "./Loader";

export default function MuiBackdrop({ isLoading }) {
    return (
        <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isLoading}
        >
            <Loader size={22} isLoading={isLoading} />
            Loading...
        </Backdrop>
    );
}