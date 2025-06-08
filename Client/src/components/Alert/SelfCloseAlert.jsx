import React, { useEffect } from "react";
import { Alert, Collapse } from "@mui/material";
//import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useDispatch, useSelector } from "react-redux";
import {
    ALERT_INFO,
    ALERT_WARNING,
    ALERT_ERROR,
    ALERT_SUCCESS,
} from "../../common/constants";
import { hideSelfCloseAlert } from "../../Redux/Counter/commonSlice";
// import { useTranslation } from "react-i18next";

export default function SelfCloseAlert() {
    const dispatch = useDispatch();
    // const { t } = useTranslation();
    const { isAlertShow, type, message } = useSelector(
        (state) => state.commonSilce.selfCloseAlert
    );

    useEffect(()=>{
        return () => {
            dispatch(hideSelfCloseAlert())
        }
    },[])

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

    const viewAlert = (severity) => {
        return <>
            <Collapse in={isAlertShow}>
                <Alert
                    variant="border"
                    severity={severity}
                    onClose={() => {
                        dispatch(hideSelfCloseAlert());
                    }}
                >
                    {message}
                </Alert>
            </Collapse>
        </>
    };

    return  <> { getAlert() } </>
}
