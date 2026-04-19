import React from "react";
import AppRoutes from "./routes/routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <AppRoutes />
    </>
  );
};

export default App;
