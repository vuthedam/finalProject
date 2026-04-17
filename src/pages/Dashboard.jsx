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
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [cateRes, transRes] = await Promise.all([
          fetch("http://localhost:3000/categories"),
          fetch("http://localhost:3000/transactions"),
        ]);

        const categoriesData = await cateRes.json();
        const transactionsData = await transRes.json();

        setCategories(categoriesData);
        setTransactions(transactionsData);
      } catch (err) {
        console.log(err);
        alert("❌ Lỗi load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const currentMonth = new Date().toISOString().slice(0, 7);

  const monthlyTransactions = useMemo(() => {
    return transactions.filter(
      (t) => t.date && String(t.date).slice(0, 7) === currentMonth,
    );
  }, [transactions, currentMonth]);

  const monthlyIncome = useMemo(() => {
    return monthlyTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }, [monthlyTransactions]);

  const monthlyExpense = useMemo(() => {
    return monthlyTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }, [monthlyTransactions]);

  const totalBudget = useMemo(() => {
    return categories
      .filter((c) => c.type === "expense")
      .reduce((sum, c) => sum + Number(c.budget || 0), 0);
  }, [categories]);

  const remainingBudget = totalBudget - monthlyExpense;

  const budgetUsedPercent = useMemo(() => {
    if (totalBudget <= 0) return 0;
    return Math.round((monthlyExpense / totalBudget) * 100);
  }, [monthlyExpense, totalBudget]);

  const expenseCategoriesCount = useMemo(() => {
    return categories.filter((c) => c.type === "expense").length;
  }, [categories]);

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
      .slice(0, 5);
  }, [transactions]);

  const topCategories = useMemo(() => {
    return categories
      .filter((c) => c.type === "expense")
      .map((c) => {
        const spent = transactions
          .filter((t) => t.categoryId == c.id && t.type === "expense")
          .reduce((sum, t) => sum + Number(t.amount || 0), 0);

        return {
          id: c.id,
          name: c.name,
          spent,
        };
      })
      .sort((a, b) => b.spent - a.spent)
      .slice(0, 5);
  }, [categories, transactions]);

  const summaryChartData = [
    { name: "Thu", value: monthlyIncome },
    { name: "Chi", value: monthlyExpense },
  ];

  const budgetTextColor =
    budgetUsedPercent > 100
      ? "text-red-500"
      : budgetUsedPercent >= 80
        ? "text-yellow-500"
        : "text-teal-600";

  const budgetBarColor =
    budgetUsedPercent > 100
      ? "bg-red-500"
      : budgetUsedPercent >= 80
        ? "bg-yellow-500"
        : "bg-teal-500";

  const progressWidth = Math.min(budgetUsedPercent, 100);

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
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-500">
              Tổng quan thu chi tháng {currentMonth}
            </p>
          </div>

          <Link
            to="/reports"
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold"
          >
            Xem Reports
          </Link>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          <div className="bg-gradient-to-br from-blue-700 to-blue-500 text-white rounded-2xl p-6 shadow-lg xl:col-span-2">
            <p className="text-sm text-blue-100 mb-2">Tổng quan tháng</p>
            <h2 className="text-4xl font-extrabold mb-4">
              {(monthlyIncome - monthlyExpense).toLocaleString()} đ
            </h2>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="px-3 py-1 rounded-full bg-white/15">
                Thu: {monthlyIncome.toLocaleString()} đ
              </span>
              <span className="px-3 py-1 rounded-full bg-white/15">
                Chi: {monthlyExpense.toLocaleString()} đ
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-slate-500 mb-2">Budget Remaining</p>
            <h2 className="text-3xl font-bold text-slate-900">
              {remainingBudget.toLocaleString()} đ
            </h2>
            <div className="mt-4">
              <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-3 ${budgetBarColor}`}
                  style={{ width: `${progressWidth}%` }}
                ></div>
              </div>
              <p className={`mt-2 text-sm font-semibold ${budgetTextColor}`}>
                {budgetUsedPercent}% ngân sách đã dùng
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-slate-500 mb-2">Expense Categories</p>
            <h2 className="text-3xl font-bold text-slate-900">
              {expenseCategoriesCount}
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              Số danh mục chi tiêu hiện có
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-slate-500 mb-2">% ngân sách đã dùng</p>
            <h2 className={`text-3xl font-bold ${budgetTextColor}`}>
              {budgetUsedPercent}%
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-slate-500 mb-2">Tổng thu tháng</p>
            <h2 className="text-3xl font-bold text-green-500">
              {monthlyIncome.toLocaleString()} đ
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-slate-500 mb-2">Tổng chi tháng</p>
            <h2 className="text-3xl font-bold text-red-500">
              {monthlyExpense.toLocaleString()} đ
            </h2>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">
                  Thu / Chi tháng này
                </h3>
                <span className="text-sm text-slate-500">{currentMonth}</span>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={summaryChartData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={110}
                      label
                    >
                      <Cell fill="#22c55e" />
                      <Cell fill="#ef4444" />
                    </Pie>
                    <Tooltip
                      formatter={(value) =>
                        `${Number(value).toLocaleString()} đ`
                      }
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-5">
                Top Categories
              </h3>

              <div className="space-y-4">
                {topCategories.length > 0 ? (
                  topCategories.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border-b border-slate-100 pb-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <span className="font-medium text-slate-700">
                          {item.name}
                        </span>
                      </div>
                      <span className="font-bold text-slate-900">
                        {item.spent.toLocaleString()} đ
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">
                    Chưa có dữ liệu danh mục
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900">
                Recent Transactions
              </h3>
              <Link
                to="/transactions"
                className="text-sm font-semibold text-blue-600"
              >
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((t) => (
                  <div key={t.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                      {t.type === "income" ? "🟢" : "🔴"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 truncate">
                        {t.description || "Transaction"}
                      </p>
                      <p className="text-xs text-slate-500">{t.date || "-"}</p>
                    </div>

                    <div className="text-right">
                      <p
                        className={`font-bold ${
                          t.type === "income"
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {t.type === "income" ? "+" : "-"}
                        {Number(t.amount || 0).toLocaleString()} đ
                      </p>
                      <span className="text-[11px] text-slate-400">
                        {t.type}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400">Chưa có giao dịch nào</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
