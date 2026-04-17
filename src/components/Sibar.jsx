import React from "react";

import { NavLink, useNavigate } from "react-router-dom";

export const Sibar = () => {
  const nav = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    nav("/login");
  };
  const baseClass =
    "flex items-center gap-3 px-4 py-3 transition-all duration-200";

  const activeClass =
    "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-bold border-r-4 border-blue-700 dark:border-blue-400";

  const inactiveClass =
    "text-slate-600 dark:text-slate-400 hover:text-blue-600 hover:bg-slate-200 dark:hover:bg-slate-800";

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-slate-50 dark:bg-slate-950 border-r z-50">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
            <span className="material-symbols-outlined">payments</span>
          </div>

          <div>
            <h1 className="text-lg font-black text-blue-700 dark:text-blue-400">
              Enterprise
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
              Expense Suite
            </p>
          </div>
        </div>

        {/* Menu */}
        <nav className="space-y-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-sm">Dashboard</span>
          </NavLink>
          <NavLink
            to="/categories"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <span className="material-symbols-outlined">category</span>
            <span className="text-sm">Categories</span>
          </NavLink>
          <NavLink
            to="/transactions"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <span className="material-symbols-outlined">receipt_long</span>
            <span className="text-sm">Transactions</span>
          </NavLink>

          <NavLink
            to="/add"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <span className="material-symbols-outlined">add_circle</span>
            <span className="text-sm">Add Expense</span>
          </NavLink>

          <NavLink
            to="/reports"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <span className="material-symbols-outlined">analytics</span>
            <span className="text-sm">Reports</span>
          </NavLink>
        </nav>
      </div>

      {/* Bottom */}
      <div className="mt-auto p-6 space-y-2">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="text-sm">Settings</span>
        </NavLink>

        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>
      </div>
    </aside>
  );
};
