import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider, useSelector } from "react-redux";
import store from "./Redux/store";
import App from './App.jsx'
import './index.css'
import 'regenerator-runtime/runtime';

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>

  <Provider store={store}>
    <App />
  </Provider>

  // </React.StrictMode>
);
