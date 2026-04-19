import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

export const Dashboard = () => {
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = JSON.parse(localStorage.getItem("user"))?.id;
  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [cateRes, expRes, incRes] = await Promise.all([
          fetch(`http://localhost:3000/expenseCategories?userId=${userId}`),
          fetch(`http://localhost:3000/expenses?userId=${userId}`),
          fetch(`http://localhost:3000/incomes?userId=${userId}`),
        ]);

        setExpenseCategories(await cateRes.json());
        setExpenses(await expRes.json());
        setIncomes(await incRes.json());
      } catch (err) {
        console.log(err);
        alert("❌ Lỗi load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const monthlyIncome = useMemo(
    () =>
      incomes
        .filter((t) => String(t.date).slice(0, 7) === currentMonth)
        .reduce((sum, t) => sum + Number(t.amount || 0), 0),
    [incomes, currentMonth]
  );

  const monthlyExpense = useMemo(
    () =>
      expenses
        .filter((t) => String(t.date).slice(0, 7) === currentMonth)
        .reduce((sum, t) => sum + Number(t.amount || 0), 0),
    [expenses, currentMonth]
  );

  const totalBudget = useMemo(
    () =>
      expenseCategories.reduce((sum, c) => sum + Number(c.budget || 0), 0),
    [expenseCategories]
  );

  const budgetUsedPercent =
    totalBudget > 0 ? Math.round((monthlyExpense / totalBudget) * 100) : 0;

  const remainingBudget = totalBudget - monthlyExpense;
  const progressWidth = Math.min(budgetUsedPercent, 100);

  const budgetTextColor =
    budgetUsedPercent > 100
      ? "text-red-500"
      : budgetUsedPercent >= 80
      ? "text-amber-500"
      : "text-emerald-600";

  const budgetBarColor =
    budgetUsedPercent > 100
      ? "bg-red-400"
      : budgetUsedPercent >= 80
      ? "bg-amber-400"
      : "bg-emerald-400";

  const recentTransactions = useMemo(() => {
    const all = [
      ...expenses.map((t) => ({ ...t, type: "expense" })),
      ...incomes.map((t) => ({ ...t, type: "income" })),
    ];

    return all
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [expenses, incomes]);

  const topExpenseCategories = useMemo(
    () =>
      expenseCategories
        .map((c) => ({
          id: c.id,
          name: c.name,
          budget: Number(c.budget || 0),
          spent: expenses
            .filter((t) => t.categoryId == c.id)
            .reduce((sum, t) => sum + Number(t.amount || 0), 0),
        }))
        .sort((a, b) => b.spent - a.spent)
        .slice(0, 5),
    [expenseCategories, expenses]
  );

  const summaryChartData = [
    { name: "Thu", value: monthlyIncome },
    { name: "Chi", value: monthlyExpense },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7fbf8]">
        <div className="rounded-3xl border border-emerald-50 bg-white/80 px-8 py-6 text-lg font-semibold text-slate-600 shadow-sm">
          ⏳ Đang tải dashboard...
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7fbf8]">
      <div className="space-y-6 p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              Tổng quan tài chính
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Theo dõi tình hình thu chi trong tháng {currentMonth}
            </p>
          </div>

          <Link
            to="/reports"
            className="rounded-2xl bg-gradient-to-r from-emerald-300 to-green-400 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
          >
            Xem Reports
          </Link>
        </div>

        {/* Hero stats */}
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-4">
          <div className="xl:col-span-2 rounded-[32px] bg-gradient-to-br from-emerald-300 via-emerald-400 to-green-400 p-6 text-white shadow-sm md:p-7">
            <p className="text-sm font-medium text-white/90">
              Số dư tháng {currentMonth}
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
              {(monthlyIncome - monthlyExpense).toLocaleString()} đ
            </h2>

            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-white/20 px-4 py-2 font-medium">
                💰 Thu: {monthlyIncome.toLocaleString()} đ
              </span>
              <span className="rounded-full bg-white/20 px-4 py-2 font-medium">
                💸 Chi: {monthlyExpense.toLocaleString()} đ
              </span>
            </div>
          </div>

          <div className="rounded-[32px] border border-emerald-50 bg-white/80 p-6 shadow-sm backdrop-blur">
            <p className="text-sm text-slate-500">Budget Remaining</p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">
              {remainingBudget.toLocaleString()} đ
            </h2>

            <div className="mt-5">
              <div className="h-3 overflow-hidden rounded-full bg-emerald-50">
                <div
                  className={`h-3 rounded-full ${budgetBarColor} transition-all`}
                  style={{ width: `${progressWidth}%` }}
                />
              </div>

              <p className={`mt-2 text-sm font-semibold ${budgetTextColor}`}>
                {budgetUsedPercent}% ngân sách đã dùng
              </p>
            </div>
          </div>

          <div className="rounded-[32px] border border-emerald-50 bg-white/80 p-6 shadow-sm backdrop-blur">
            <p className="text-sm text-slate-500">Expense Categories</p>
            <h2 className="mt-2 text-4xl font-black text-slate-900">
              {expenseCategories.length}
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Số danh mục chi tiêu hiện có
            </p>

            <Link
              to="/expense/categories"
              className="mt-4 inline-block text-sm font-semibold text-emerald-600 transition hover:text-emerald-700"
            >
              Xem tất cả →
            </Link>
          </div>
        </section>

        {/* Stat row 2 */}
        <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="rounded-[30px] border border-emerald-50 bg-white/80 p-6 shadow-sm">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-lg">
              💰
            </div>
            <p className="text-sm text-slate-500">Tổng thu tháng</p>
            <h2 className="mt-2 text-3xl font-black text-emerald-500">
              {monthlyIncome.toLocaleString()} đ
            </h2>
            <Link
              to="/income/transactions"
              className="mt-3 inline-block text-sm font-semibold text-emerald-600"
            >
              Xem chi tiết →
            </Link>
          </div>

          <div className="rounded-[30px] border border-emerald-50 bg-white/80 p-6 shadow-sm">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-lg">
              💸
            </div>
            <p className="text-sm text-slate-500">Tổng chi tháng</p>
            <h2 className="mt-2 text-3xl font-black text-rose-500">
              {monthlyExpense.toLocaleString()} đ
            </h2>
            <Link
              to="/expense/transactions"
              className="mt-3 inline-block text-sm font-semibold text-emerald-600"
            >
              Xem chi tiết →
            </Link>
          </div>

          <div className="rounded-[30px] border border-emerald-50 bg-white/80 p-6 shadow-sm">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-lg">
              📊
            </div>
            <p className="text-sm text-slate-500">% Ngân sách đã dùng</p>
            <h2 className={`mt-2 text-3xl font-black ${budgetTextColor}`}>
              {budgetUsedPercent}%
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Trên tổng budget {totalBudget.toLocaleString()} đ
            </p>
          </div>
        </section>

        {/* Charts + side */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            {/* Pie chart */}
            <div className="rounded-[32px] border border-emerald-50 bg-white/80 p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Thu / Chi tháng này
                  </h3>
                  <p className="text-sm text-slate-500">{currentMonth}</p>
                </div>
              </div>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={summaryChartData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      label
                    >
                      <Cell fill="#4ade80" />
                      <Cell fill="#fb7185" />
                    </Pie>
                    <Tooltip
                      formatter={(v) => `${Number(v).toLocaleString()} đ`}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top categories */}
            <div className="rounded-[32px] border border-emerald-50 bg-white/80 p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">
                  Top Expense Categories
                </h3>
                <Link
                  to="/expense/categories"
                  className="text-sm font-semibold text-emerald-600"
                >
                  Xem tất cả
                </Link>
              </div>

              <div className="space-y-3">
                {topExpenseCategories.length > 0 ? (
                  topExpenseCategories.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-2xl bg-[#f8fcf9] px-4 py-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-rose-50 text-sm font-bold text-rose-500">
                          {index + 1}
                        </div>
                        <span className="font-medium text-slate-700">
                          {item.name}
                        </span>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-rose-500">
                          {item.spent.toLocaleString()} đ
                        </p>
                        {item.budget > 0 && (
                          <p className="text-xs text-slate-400">
                            / {item.budget.toLocaleString()} đ
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">Chưa có dữ liệu</p>
                )}
              </div>
            </div>
          </div>

          {/* Recent transactions */}
          <div className="rounded-[32px] border border-emerald-50 bg-white/80 p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                Recent Transactions
              </h3>
            </div>

            <div className="space-y-4">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((t) => (
                  <div
                    key={`${t.type}-${t.id}`}
                    className="flex items-center gap-3 rounded-2xl bg-[#f8fcf9] p-3"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-lg shadow-sm">
                      {t.type === "income" ? "💰" : "💸"}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-slate-900">
                        {t.description || "Transaction"}
                      </p>
                      <p className="text-xs text-slate-500">{t.date || "-"}</p>
                    </div>

                    <p
                      className={`text-sm font-bold ${
                        t.type === "income" ? "text-emerald-600" : "text-rose-500"
                      }`}
                    >
                      {t.type === "income" ? "+" : "-"}
                      {Number(t.amount || 0).toLocaleString()} đ
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400">Chưa có giao dịch nào</p>
              )}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Link
                to="/income/transactions"
                className="rounded-2xl bg-emerald-50 py-3 text-center text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
              >
                + Income
              </Link>
              <Link
                to="/expense/transactions"
                className="rounded-2xl bg-rose-50 py-3 text-center text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
              >
                + Expense
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};