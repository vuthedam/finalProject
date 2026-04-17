import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";

export const Reports = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [groupBy, setGroupBy] = useState("day");

  useEffect(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    setFromDate(firstDay.toISOString().slice(0, 10));
    setToDate(today.toISOString().slice(0, 10));
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:3000/transactions");
        const data = await res.json();
        setTransactions(data);
      } catch (err) {
        console.log(err);
        alert("❌ Lỗi load reports data");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (!t.date) return false;
      if (!fromDate || !toDate) return true;

      const current = new Date(t.date);
      const start = new Date(fromDate);
      const end = new Date(toDate);

      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      return current >= start && current <= end;
    });
  }, [transactions, fromDate, toDate]);

  const incomeTotal = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }, [filteredTransactions]);

  const expenseTotal = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }, [filteredTransactions]);

  const groupedChartData = useMemo(() => {
    const getWeekLabel = (dateString) => {
      const date = new Date(dateString);
      const firstDay = new Date(date.getFullYear(), 0, 1);
      const diffDays = Math.floor(
        (date - firstDay) / (1000 * 60 * 60 * 24),
      );
      const week = Math.ceil((diffDays + firstDay.getDay() + 1) / 7);
      return `${date.getFullYear()}-W${String(week).padStart(2, "0")}`;
    };

    const map = {};

    filteredTransactions.forEach((t) => {
      if (!t.date) return;

      let key = "";

      if (groupBy === "day") {
        key = String(t.date).slice(0, 10);
      } else if (groupBy === "month") {
        key = String(t.date).slice(0, 7);
      } else if (groupBy === "week") {
        key = getWeekLabel(t.date);
      }

      if (!map[key]) {
        map[key] = {
          label: key,
          income: 0,
          expense: 0,
        };
      }

      if (t.type === "income") {
        map[key].income += Number(t.amount || 0);
      } else if (t.type === "expense") {
        map[key].expense += Number(t.amount || 0);
      }
    });

    return Object.values(map).sort((a, b) => a.label.localeCompare(b.label));
  }, [filteredTransactions, groupBy]);

  const handleQuickFilter = (type) => {
    const today = new Date();
    const end = today.toISOString().slice(0, 10);

    if (type === "7days") {
      const start = new Date();
      start.setDate(today.getDate() - 6);
      setFromDate(start.toISOString().slice(0, 10));
      setToDate(end);
    }

    if (type === "30days") {
      const start = new Date();
      start.setDate(today.getDate() - 29);
      setFromDate(start.toISOString().slice(0, 10));
      setToDate(end);
    }

    if (type === "month") {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      setFromDate(start.toISOString().slice(0, 10));
      setToDate(end);
    }

    if (type === "year") {
      const start = new Date(today.getFullYear(), 0, 1);
      setFromDate(start.toISOString().slice(0, 10));
      setToDate(end);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        ⏳ Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="p-6 md:p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reports</h1>
          <p className="text-sm text-slate-500">
            Chọn ngày, lọc dữ liệu và xem biểu đồ theo tuần / tháng / khoảng thời gian
          </p>
        </div>

        <section className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Từ ngày
              </label>
              <input
                type="date"
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Đến ngày
              </label>
              <input
                type="date"
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Nhóm theo
              </label>
              <select
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5"
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
              >
                <option value="day">Ngày</option>
                <option value="week">Tuần</option>
                <option value="month">Tháng</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setFromDate("");
                  setToDate("");
                }}
                className="w-full bg-slate-200 text-slate-700 rounded-xl px-4 py-2.5 font-semibold"
              >
                Xóa lọc
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleQuickFilter("7days")}
              className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-semibold"
            >
              7 ngày
            </button>
            <button
              onClick={() => handleQuickFilter("30days")}
              className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-semibold"
            >
              30 ngày
            </button>
            <button
              onClick={() => handleQuickFilter("month")}
              className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-semibold"
            >
              Tháng này
            </button>
            <button
              onClick={() => handleQuickFilter("year")}
              className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-semibold"
            >
              Năm nay
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-slate-500 mb-2">Tổng thu</p>
            <h2 className="text-3xl font-bold text-green-500">
              {incomeTotal.toLocaleString()} đ
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-slate-500 mb-2">Tổng chi</p>
            <h2 className="text-3xl font-bold text-red-500">
              {expenseTotal.toLocaleString()} đ
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-slate-500 mb-2">Chênh lệch</p>
            <h2 className="text-3xl font-bold text-blue-600">
              {(incomeTotal - expenseTotal).toLocaleString()} đ
            </h2>
          </div>
        </section>

        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-5">
            Biểu đồ thu / chi
          </h3>

          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={groupedChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip
                  formatter={(value) =>
                    `${Number(value).toLocaleString()} đ`
                  }
                />
                <Legend />
                <Bar dataKey="income" fill="#22c55e" name="Thu" />
                <Bar dataKey="expense" fill="#ef4444" name="Chi" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-5">
            Xu hướng thu / chi
          </h3>

          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={groupedChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip
                  formatter={(value) =>
                    `${Number(value).toLocaleString()} đ`
                  }
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#22c55e"
                  strokeWidth={3}
                  name="Thu"
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#ef4444"
                  strokeWidth={3}
                  name="Chi"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </main>
  );
};