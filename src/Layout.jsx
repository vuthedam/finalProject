import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./components/Header";
import { Sibar } from "./components/Sibar";

export const Layout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sibar />

      <div className="md:ml-64">
        <div className="sticky top-0 z-40 bg-white shadow-sm">
          <Header />
        </div>

        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
