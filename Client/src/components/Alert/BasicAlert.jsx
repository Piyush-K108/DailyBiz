import React, { useEffect } from "react";
import { Alert, Stack, Snackbar, Fade } from "@mui/material";
//import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useDispatch, useSelector } from "react-redux";
import {
    ALERT_INFO,
    ALERT_WARNING,
    ALERT_ERROR,
    ALERT_SUCCESS,
} from "../../common/constants";
import { hideAlert } from "../../Redux/Counter/commonSlice";
import config, { snackbarSetting } from "../../config";

export default function BasicAlert() {
    const dispatch = useDispatch();
    const { isAlertShow, type, message } = useSelector(
        (state) => state.commonSilce
    );
    /**
     * Snackbar setting
     */
    const vertical = snackbarSetting.vertical;
    const horizontal = snackbarSetting.horizontal;
    const autoHideDuration = snackbarSetting.autoHideDuration;

    /**
     * Component mount & unmount
     */
    useEffect(() => {
        /**
         * Component unmount
         */
        // return () => {
        //     //resetAllStates();
        // };
    }, []);
    /**
     * Comman alert
     */
    const alertBox = (severity) => (
        <Alert
            // iconMapping={{
            //     success: <CheckCircleOutlineIcon fontSize="inherit" />,
            //   }}
            variant={config.alertVariant}
            severity={severity}
            onClose={() => {
                dispatch(hideAlert());
            }}
        >
            {message}
        </Alert>
    );

    /**
     * Simple alert
     */
    const SimpleAlert = (props) => {
        return (
            <Stack sx={{ width: "100%" }} spacing={2}>
                {alertBox(props.severity)}
            </Stack>
        );
    };

    /**
     * Snackbar alert
     */
    const SnackbarAlert = (props) => {
        return (
            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={isAlertShow}
                autoHideDuration={autoHideDuration}
                onClose={() => {
                    dispatch(hideAlert());
                }}
                TransitionComponent={Fade}
                key={vertical + horizontal}
                sx={{ width: 200 }}
            >
                {alertBox(props.severity)}
            </Snackbar>
        );
    };

    const getAlert = () => {
        switch (type) {
            case ALERT_INFO:
                return viewAlert("info");
            case ALERT_WARNING:
                return viewAlert("warning");
            case ALERT_ERROR:
                return viewAlert("error");
            case ALERT_SUCCESS:
                return viewAlert("success");
            default:
                return null;
        }
    };

    const viewAlert = (msgType) => {
        return config.alertDisplayType === "Snackbar" ? (
            <SnackbarAlert severity={msgType} />
        ) : (
            <SimpleAlert severity={msgType} />
        );
    };

    return <>{isAlertShow ? getAlert() : null}</>;
}
