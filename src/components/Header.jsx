import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBudgetAlerts } from "../hooks/useBudgetAlerts";

export const Header = () => {
  const alerts = useBudgetAlerts();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const overBudget = alerts.filter((a) => a.percent >= 100);
  const nearBudget = alerts.filter((a) => a.percent >= 80 && a.percent < 100);

  return (
    <header className="w-full bg-white/80 backdrop-blur-md shadow-sm flex justify-between items-center px-6 py-3">
      <h2 className="text-xl font-bold tracking-tight text-blue-700 md:hidden">SpendLogic</h2>

      <div className="flex items-center gap-4 ml-auto">
        {/* NOTIFICATION BELL */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition relative"
          >
            <span className="material-symbols-outlined">notifications</span>
            {alerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b flex items-center justify-between">
                <h3 className="font-bold text-slate-800">Thông báo ngân sách</h3>
                {alerts.length > 0 && (
                  <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">
                    {alerts.length}
                  </span>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {alerts.length === 0 ? (
                  <div className="px-4 py-6 text-center text-slate-400 text-sm">
                    ✅ Tất cả ngân sách đang ổn
                  </div>
                ) : (
                  <>
                    {overBudget.length > 0 && (
                      <div>
                        <p className="px-4 py-2 text-xs font-bold text-red-500 uppercase tracking-wide bg-red-50">
                          🚨 Vượt ngân sách
                        </p>
                        {overBudget.map((a) => (
                          <div
                            key={a.id}
                            onClick={() => { navigate("/expense/categories"); setOpen(false); }}
                            className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50"
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-semibold text-slate-800 text-sm">{a.name}</span>
                              <span className="text-xs font-bold text-red-600">{a.percent}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div className="h-1.5 bg-red-500 rounded-full" style={{ width: "100%" }} />
                            </div>
                            <p className="text-xs text-slate-400 mt-1">
                              {a.spent.toLocaleString()} đ / {Number(a.budget).toLocaleString()} đ
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {nearBudget.length > 0 && (
                      <div>
                        <p className="px-4 py-2 text-xs font-bold text-yellow-600 uppercase tracking-wide bg-yellow-50">
                          ⚠️ Gần đạt ngân sách
                        </p>
                        {nearBudget.map((a) => (
                          <div
                            key={a.id}
                            onClick={() => { navigate("/expense/categories"); setOpen(false); }}
                            className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50"
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-semibold text-slate-800 text-sm">{a.name}</span>
                              <span className="text-xs font-bold text-yellow-600">{a.percent}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div className="h-1.5 bg-yellow-400 rounded-full" style={{ width: `${a.percent}%` }} />
                            </div>
                            <p className="text-xs text-slate-400 mt-1">
                              {a.spent.toLocaleString()} đ / {Number(a.budget).toLocaleString()} đ
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-[1px] bg-slate-200 mx-1" />

        {/* USER */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            {user?.fullname?.charAt(0).toUpperCase() || "U"}
          </div>
          <span className="hidden lg:block text-sm font-medium text-slate-700">
            {user?.fullname || "User"}
          </span>
        </div>
      </div>
    </header>
  );
};
