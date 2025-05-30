import React, { useEffect } from "react";
import { messaging } from "../firebase/firebaseConfig";
import { toast, ToastContainer } from "react-toastify";
import Message from "./Message";
import "react-toastify/dist/ReactToastify.css";
import { onMessage } from "firebase/messaging";

function Notifications() {

  // Set up listener for incoming messages
  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Received message payload:", payload);
      toast(<Message notification={payload.notification} />);
    });

    return () => {
      // Unsubscribe when component unmounts
      unsubscribe();
    };
  }, []);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={"Bounce"}
      />
    </>
  );
}

export default Notifications;
