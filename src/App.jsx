import React from "react";
import AppRoutes from "./routes/routes";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <>
      <ToastContainer />
      <AppRoutes />;
    </>
  );
};

export default App;
