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
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#4ade80", "#86efac", "#22c55e", "#bbf7d0", "#16a34a"];

export const Reports = () => {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [groupBy, setGroupBy] = useState("day");

  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    const today = new Date();
    setFromDate(
      new Date(today.getFullYear(), today.getMonth(), 1)
        .toISOString()
        .slice(0, 10),
    );
    setToDate(today.toISOString().slice(0, 10));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [resE, resI, resC] = await Promise.all([
          fetch(`http://localhost:3000/expenses?userId=${userId}`),
          fetch(`http://localhost:3000/incomes?userId=${userId}`),
          fetch(`http://localhost:3000/expenseCategories?userId=${userId}`),
        ]);

        setExpenses(await resE.json());
        setIncomes(await resI.json());
        setExpenseCategories(await resC.json());
      } catch (err) {
        console.log(err);
        alert("❌ Lỗi load reports data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const inRange = (date) => {
    if (!date) return false;
    if (!fromDate || !toDate) return true;

    const d = new Date(date);
    const s = new Date(fromDate);
    s.setHours(0, 0, 0, 0);

    const e = new Date(toDate);
    e.setHours(23, 59, 59, 999);

    return d >= s && d <= e;
  };

  const filteredExpenses = useMemo(
    () => expenses.filter((t) => inRange(t.date)),
    [expenses, fromDate, toDate],
  );

  const filteredIncomes = useMemo(
    () => incomes.filter((t) => inRange(t.date)),
    [incomes, fromDate, toDate],
  );

  const incomeTotal = useMemo(
    () => filteredIncomes.reduce((sum, t) => sum + Number(t.amount || 0), 0),
    [filteredIncomes],
  );

  const expenseTotal = useMemo(
    () => filteredExpenses.reduce((sum, t) => sum + Number(t.amount || 0), 0),
    [filteredExpenses],
  );

  const balance = incomeTotal - expenseTotal;

  const savingPercent =
    incomeTotal > 0 ? Math.round((balance / incomeTotal) * 100) : 0;

  const getKey = (date) => {
    if (groupBy === "month") return String(date).slice(0, 7);

    if (groupBy === "week") {
      const d = new Date(date);
      const first = new Date(d.getFullYear(), 0, 1);
      const week = Math.ceil(
        (Math.floor((d - first) / 86400000) + first.getDay() + 1) / 7,
      );
      return `${d.getFullYear()}-W${String(week).padStart(2, "0")}`;
    }

    return String(date).slice(0, 10);
  };

  const groupedChartData = useMemo(() => {
    const map = {};

    filteredExpenses.forEach((t) => {
      const key = getKey(t.date);
      if (!map[key]) map[key] = { label: key, income: 0, expense: 0 };
      map[key].expense += Number(t.amount || 0);
    });

    filteredIncomes.forEach((t) => {
      const key = getKey(t.date);
      if (!map[key]) map[key] = { label: key, income: 0, expense: 0 };
      map[key].income += Number(t.amount || 0);
    });

    return Object.values(map).sort((a, b) => a.label.localeCompare(b.label));
  }, [filteredExpenses, filteredIncomes, groupBy]);

  const categoryPieData = useMemo(() => {
    return expenseCategories
      .map((c) => ({
        name: c.name,
        value: filteredExpenses
          .filter((t) => t.categoryId == c.id)
          .reduce((sum, t) => sum + Number(t.amount || 0), 0),
      }))
      .filter((c) => c.value > 0);
  }, [expenseCategories, filteredExpenses]);

  const handleQuickFilter = (type) => {
    const today = new Date();
    const end = today.toISOString().slice(0, 10);

    const starts = {
      "7days": () => {
        const d = new Date();
        d.setDate(today.getDate() - 6);
        return d;
      },
      "30days": () => {
        const d = new Date();
        d.setDate(today.getDate() - 29);
        return d;
      },
      month: () => new Date(today.getFullYear(), today.getMonth(), 1),
      year: () => new Date(today.getFullYear(), 0, 1),
    };

    setFromDate(starts[type]().toISOString().slice(0, 10));
    setToDate(end);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7fbf8]">
        <div className="rounded-[28px] border border-emerald-50 bg-white/85 px-8 py-6 text-lg font-semibold text-slate-600 shadow-sm">
          ⏳ Đang tải báo cáo...
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7fbf8]">
      <div className="space-y-6 p-6 md:p-8">
        {/* Header */}
        <section className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-emerald-300 via-emerald-400 to-green-400 p-7 text-white shadow-sm md:p-8">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/90">
              Reports
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
              Financial Analytics
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-white/90 md:text-base">
              Phân tích thu chi theo thời gian, theo dõi xu hướng tài chính và
              xem danh mục chi tiêu nổi bật của bạn.
            </p>
          </div>
        </section>

        {/* Filter */}
        <section className="rounded-[32px] border border-emerald-50 bg-white/85 p-6 shadow-sm">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Bộ lọc báo cáo
              </h2>
              <p className="text-sm text-slate-500">
                Chọn khoảng thời gian và kiểu nhóm dữ liệu
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                ["7days", "7 ngày"],
                ["30days", "30 ngày"],
                ["month", "Tháng này"],
                ["year", "Năm nay"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => handleQuickFilter(key)}
                  className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">
                Từ ngày
              </label>
              <input
                type="date"
                className="w-full rounded-3xl border border-transparent bg-emerald-50/60 px-5 py-3.5 text-sm outline-none transition focus:bg-white focus:ring-4 focus:ring-emerald-100"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">
                Đến ngày
              </label>
              <input
                type="date"
                className="w-full rounded-3xl border border-transparent bg-emerald-50/60 px-5 py-3.5 text-sm outline-none transition focus:bg-white focus:ring-4 focus:ring-emerald-100"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">
                Nhóm theo
              </label>
              <select
                className="w-full rounded-3xl border border-transparent bg-emerald-50/60 px-5 py-3.5 text-sm outline-none transition focus:bg-white focus:ring-4 focus:ring-emerald-100"
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
                className="w-full rounded-3xl bg-emerald-50 px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-white"
              >
                Xóa lọc
              </button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="rounded-[30px] border border-emerald-50 bg-white/85 p-6 shadow-sm">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-lg">
              💰
            </div>
            <p className="text-sm text-slate-500">Tổng thu</p>
            <h2 className="mt-2 text-3xl font-black text-emerald-500">
              {incomeTotal.toLocaleString()} đ
            </h2>
            <p className="mt-2 text-xs text-slate-400">
              {filteredIncomes.length} giao dịch
            </p>
          </div>

          <div className="rounded-[30px] border border-emerald-50 bg-white/85 p-6 shadow-sm">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-lg">
              💸
            </div>
            <p className="text-sm text-slate-500">Tổng chi</p>
            <h2 className="mt-2 text-3xl font-black text-rose-500">
              {expenseTotal.toLocaleString()} đ
            </h2>
            <p className="mt-2 text-xs text-slate-400">
              {filteredExpenses.length} giao dịch
            </p>
          </div>

          <div className="rounded-[30px] border border-emerald-50 bg-white/85 p-6 shadow-sm">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-lg">
              📊
            </div>
            <p className="text-sm text-slate-500">Chênh lệch</p>
            <h2
              className={`mt-2 text-3xl font-black ${
                balance >= 0 ? "text-emerald-600" : "text-rose-500"
              }`}
            >
              {balance.toLocaleString()} đ
            </h2>
            <p className="mt-2 text-xs text-slate-400">
              {incomeTotal > 0 ? `Tiết kiệm ${savingPercent}%` : "-"}
            </p>
          </div>
        </section>

        {/* Bar chart */}
        <section className="rounded-[32px] border border-emerald-50 bg-white/85 p-6 shadow-sm">
          <div className="mb-5">
            <h3 className="text-lg font-bold text-slate-900">
              Biểu đồ thu / chi
            </h3>
            <p className="text-sm text-slate-500">
              So sánh thu nhập và chi tiêu theo {groupBy}
            </p>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={groupedChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => `${Number(v).toLocaleString()} đ`} />
                <Legend />
                <Bar
                  dataKey="income"
                  fill="#4ade80"
                  name="Thu"
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey="expense"
                  fill="#fb7185"
                  name="Chi"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Line + Pie */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="rounded-[32px] border border-emerald-50 bg-white/85 p-6 shadow-sm">
            <div className="mb-5">
              <h3 className="text-lg font-bold text-slate-900">
                Xu hướng thu / chi
              </h3>
              <p className="text-sm text-slate-500">
                Theo dõi biến động tài chính theo thời gian
              </p>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={groupedChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(v) => `${Number(v).toLocaleString()} đ`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#4ade80"
                    strokeWidth={3}
                    name="Thu"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="expense"
                    stroke="#fb7185"
                    strokeWidth={3}
                    name="Chi"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-[32px] border border-emerald-50 bg-white/85 p-6 shadow-sm">
            <div className="mb-5">
              <h3 className="text-lg font-bold text-slate-900">
                Chi tiêu theo danh mục
              </h3>
              <p className="text-sm text-slate-500">
                Tỷ trọng chi tiêu trong từng danh mục
              </p>
            </div>

            {categoryPieData.length > 0 ? (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryPieData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      innerRadius={55}
                      paddingAngle={3}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {categoryPieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v) => `${Number(v).toLocaleString()} đ`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-72 items-center justify-center text-slate-400">
                Không có dữ liệu
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};
