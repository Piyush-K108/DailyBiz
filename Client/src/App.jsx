import React, { useEffect } from "react";
import { BrowserRouter, Routes, Navigate, Route, useLocation } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useSelector, connect } from "react-redux";
import { checkAuthenticated } from "./Redux/Counter/counterAction.jsx";
import { themeSettings } from "./theam";
import ThemeCustomization from "./themes";
import Layout from "./components/Layout";
import "./App.css";

// Page components
import Dashboard from "./pages/Dashboard/dashboard.jsx";
import Customers from "./pages/Customer/customer.jsx";
import Products from "./pages/Products/products.jsx";
import Purchase from "./pages/Purchase/purchase.jsx";
import Sales from "./pages/Sales/sales.jsx";
import Vendors from "./pages/Vendors/vendors.jsx";
import Ledger from "./pages/Ledger/ledger.jsx";
import Login from "./pages/admin-auth/Login";
import Profile from "./pages/Profile/Profile.jsx";

const allNavItems = [
  { text: "Dashboard", path: "/dashboard", element: <Dashboard /> },
  { text: "Profile", path: "/profile", element: <Profile /> },
  { text: "Customers", path: "/customers", element: <Customers /> },
  { text: "Products", path: "/products", element: <Products /> },
  { text: "Purchase", path: "/purchase", element: <Purchase /> },
  { text: "Sales", path: "/sales", element: <Sales /> },
  { text: "Vendors", path: "/vendors", element: <Vendors /> },
  { text: "Ledger", path: "/ledger", element: <Ledger /> },
];

function AppContent({ checkAuthenticated }) {
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.counter.isAuthenticated);
  const phone = useSelector((state) => state.counter.phone);
  const allowedContacts = ["6262302626", "7024949888"];
  const hasRevenueAccess = isAuthenticated && allowedContacts.includes(phone);

  useEffect(() => {
    if (location.pathname !== "/login") {
      sessionStorage.setItem("lastVisited", location.pathname);
      sessionStorage.setItem("lastState", JSON.stringify(location.state || {}));
    }
  }, [location]);

  useEffect(() => {
    checkAuthenticated();
  }, [checkAuthenticated]);

  const navItems = allNavItems.filter((item) =>
    item.text === "Revenue" ? hasRevenueAccess : true
  );

  const lastVisited = sessionStorage.getItem("lastVisited") || "/dashboard";
  const lastState = JSON.parse(sessionStorage.getItem("lastState") || "{}");

  const mode = useSelector((state) => state.global.mode);
  const theme = React.useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <ThemeCustomization>
      <CssBaseline />
      <Routes>
        {isAuthenticated ? (
          <Route element={<Layout hasRevenueAccess={hasRevenueAccess} />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            {navItems.map((item, index) => (
              <Route key={index} path={item.path} element={item.element} />
            ))}
            <Route path="*" element={<Navigate to={lastVisited} state={lastState} replace />} />
          </Route>
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}
      </Routes>
    </ThemeCustomization>
  );
}

function App(props) {
  return (
    <BrowserRouter>
      <AppContent {...props} />
    </BrowserRouter>
  );
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.counter.isAuthenticated,
});

export default connect(mapStateToProps, { checkAuthenticated })(App);
