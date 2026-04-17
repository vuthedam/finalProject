import React from "react";
import { Header } from "./components/Header";
import { Outlet } from "react-router-dom";
import { Sibar } from "./components/Sibar";

export const Layout = () => {
  return (
    <>
      <Sibar />

      <div className="md:ml-64">
        <Header className="fixed top-0 left-64 right-0 z-50 bg-white" />
        <Outlet />
      </div>
    </>
  );
};
