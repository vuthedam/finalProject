import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

export const Sibar = () => {
  const nav = useNavigate();
  const { pathname } = useLocation();

  const [incomeOpen, setIncomeOpen] = useState(pathname.startsWith("/income"));
  const [expenseOpen, setExpenseOpen] = useState(
    pathname.startsWith("/expense"),
  );

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    nav("/login");
  };

  const baseClass =
    "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm transition-all duration-200";

  const activeClass = "bg-emerald-100 text-emerald-700 font-semibold";

  const inactiveClass =
    "text-slate-600 hover:bg-emerald-50 hover:text-emerald-600";

  const subClass =
    "flex items-center gap-2 px-4 py-2.5 pl-11 rounded-2xl text-sm transition-all duration-200";

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-[#f7fbf8] border-r border-emerald-50 z-50">
      {/* Content */}
      <div className="p-4 flex-1 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 px-2 pt-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-400 flex items-center justify-center text-white shadow-sm">
            ₫
          </div>
          <div>
            <h1 className="text-base font-bold text-emerald-600">
              Expense Track
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
              Finance
            </p>
          </div>
        </div>

        <nav className="space-y-1">
          {/* Dashboard */}
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <span className="material-symbols-outlined text-[20px]">
              dashboard
            </span>
            Dashboard
          </NavLink>

          {/* Income */}
          <div>
            <button
              onClick={() => setIncomeOpen((o) => !o)}
              className={`w-full ${baseClass} ${
                pathname.startsWith("/income") ? activeClass : inactiveClass
              } justify-between`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-emerald-500">
                  trending_up
                </span>
                Income
              </div>

              <span className="material-symbols-outlined text-base">
                {incomeOpen ? "expand_less" : "expand_more"}
              </span>
            </button>

            {incomeOpen && (
              <div className="mt-1 space-y-1">
                <NavLink
                  to="/income/categories"
                  className={({ isActive }) =>
                    `${subClass} ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700 font-semibold"
                        : inactiveClass
                    }`
                  }
                >
                  <span className="material-symbols-outlined text-base">
                    category
                  </span>
                  Categories
                </NavLink>

                <NavLink
                  to="/income/transactions"
                  className={({ isActive }) =>
                    `${subClass} ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700 font-semibold"
                        : inactiveClass
                    }`
                  }
                >
                  <span className="material-symbols-outlined text-base">
                    receipt_long
                  </span>
                  Transactions
                </NavLink>
              </div>
            )}
          </div>

          {/* Expense */}
          <div>
            <button
              onClick={() => setExpenseOpen((o) => !o)}
              className={`w-full ${baseClass} ${
                pathname.startsWith("/expense") ? activeClass : inactiveClass
              } justify-between`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-red-400">
                  trending_down
                </span>
                Expense
              </div>

              <span className="material-symbols-outlined text-base">
                {expenseOpen ? "expand_less" : "expand_more"}
              </span>
            </button>

            {expenseOpen && (
              <div className="mt-1 space-y-1">
                <NavLink
                  to="/expense/categories"
                  className={({ isActive }) =>
                    `${subClass} ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700 font-semibold"
                        : inactiveClass
                    }`
                  }
                >
                  <span className="material-symbols-outlined text-base">
                    category
                  </span>
                  Categories
                </NavLink>

                <NavLink
                  to="/expense/transactions"
                  className={({ isActive }) =>
                    `${subClass} ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700 font-semibold"
                        : inactiveClass
                    }`
                  }
                >
                  <span className="material-symbols-outlined text-base">
                    receipt_long
                  </span>
                  Transactions
                </NavLink>
              </div>
            )}
          </div>

          {/* Reports */}
          <NavLink
            to="/reports"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <span className="material-symbols-outlined text-[20px]">
              analytics
            </span>
            Reports
          </NavLink>
        </nav>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-emerald-50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-400 hover:bg-red-50 transition"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="text-sm font-semibold">Logout</span>
        </button>
      </div>
    </aside>
  );
};
