import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useBudgetAlerts } from "../../hooks/useBudgetAlerts";

export const ExpenseCategories = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const userId = JSON.parse(localStorage.getItem("user"))?.id;
  const alerts = useBudgetAlerts();
  const alertMap = Object.fromEntries(alerts.map((a) => [a.id, a]));

  const fetchData = async () => {
    try {
      setLoading(true);

      const [cateRes, transRes] = await Promise.all([
        fetch(`http://localhost:3000/expenseCategories?userId=${userId}`),
        fetch(`http://localhost:3000/expenses?userId=${userId}`),
      ]);

      setCategories(await cateRes.json());
      setTransactions(await transRes.json());
    } catch (err) {
      alert("❌ Lỗi load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredCategories = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return categories.filter(
      (c) => !keyword || c.name?.toLowerCase().includes(keyword),
    );
  }, [categories, search]);

  const spentByCategory = (id) =>
    transactions
      .filter((t) => t.categoryId == id)
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalExpense = transactions.reduce(
    (sum, t) => sum + Number(t.amount || 0),
    0,
  );

  const totalBudget = categories.reduce(
    (sum, c) => sum + Number(c.budget || 0),
    0,
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa danh mục này?")) return;

    if (transactions.some((t) => t.categoryId == id))
      return alert("Danh mục này còn transaction!");

    await fetch(`http://localhost:3000/expenseCategories/${id}`, {
      method: "DELETE",
    });

    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7fbf8]">
        <div className="rounded-3xl bg-white px-6 py-4 shadow-sm text-slate-600">
          ⏳ Loading...
        </div>
      </div>
    );

  return (
    <main className="min-h-screen bg-[#f7fbf8]">
      <div className="space-y-6 p-6 md:p-8">
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Expense
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">
              Categories
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Quản lý danh mục chi tiêu
            </p>
          </div>

          <button
            onClick={() => navigate("/expense/categories/create")}
            className="rounded-2xl bg-gradient-to-r from-rose-300 to-red-400 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-95"
          >
            + Add Category
          </button>
        </div>

        {/* STATS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white/80 border border-emerald-50 rounded-3xl p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Categories</p>
            <h2 className="text-3xl font-black mt-2">{categories.length}</h2>
          </div>

          <div className="bg-white/80 border border-emerald-50 rounded-3xl p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Budget</p>
            <h2 className="text-3xl font-black text-emerald-500 mt-2">
              {totalBudget.toLocaleString()} đ
            </h2>
          </div>

          <div className="bg-white/80 border border-emerald-50 rounded-3xl p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Spent</p>
            <h2 className="text-3xl font-black text-rose-500 mt-2">
              {totalExpense.toLocaleString()} đ
            </h2>
          </div>
        </section>

        {/* SEARCH */}
        <div>
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm rounded-3xl bg-emerald-50/60 px-5 py-3 text-sm outline-none border border-transparent focus:bg-white focus:ring-4 focus:ring-emerald-100"
          />
        </div>

        {/* TABLE */}
        <div className="bg-white/80 border border-emerald-50 rounded-[32px] shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f8fcf9] text-slate-500">
                <th className="px-6 py-4 text-left">Category</th>
                <th className="px-6 py-4 text-left">Budget</th>
                <th className="px-6 py-4 text-left">Đã chi</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCategories.map((c) => {
                const alert = alertMap[c.id];
                const isOver = alert?.percent >= 100;
                const isNear = alert?.percent >= 80 && alert?.percent < 100;
                return (
                <tr
                  key={c.id}
                  className={`border-t transition ${
                    isOver ? "bg-red-50 hover:bg-red-100" :
                    isNear ? "bg-yellow-50 hover:bg-yellow-100" :
                    "hover:bg-[#f8fcf9]"
                  }`}
                >
                  <td className="px-6 py-4 font-semibold text-emerald-600">
                    <Link to={`/expense/transactions?categoryId=${c.id}`}>
                      {c.name}
                    </Link>
                  </td>

                  <td className="px-6 py-4">
                    {Number(c.budget || 0).toLocaleString()} đ
                  </td>

                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${
                          isOver ? "text-red-600" : isNear ? "text-yellow-600" : "text-rose-500"
                        }`}>
                          {spentByCategory(c.id).toLocaleString()} đ
                        </span>
                        {isOver && (
                          <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">
                            🚨 Vượt {alert.percent}%
                          </span>
                        )}
                        {isNear && (
                          <span className="text-xs bg-yellow-100 text-yellow-700 font-bold px-2 py-0.5 rounded-full">
                            ⚠️ {alert.percent}%
                          </span>
                        )}
                      </div>
                      {alert && (
                        <div className="w-32 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${
                              isOver ? "bg-red-500" : "bg-yellow-400"
                            }`}
                            style={{ width: `${Math.min(alert.percent, 100)}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right space-x-3">
                    <button
                      onClick={() => navigate(`/expense/categories/${c.id}/edit`)}
                      className="text-emerald-600 font-medium hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-rose-500 font-medium hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
                );
              })}

              {filteredCategories.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-slate-400">
                    Không tìm thấy danh mục nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="px-6 py-4 text-sm text-slate-500 border-t">
            Total: {filteredCategories.length} categories
          </div>
        </div>
      </div>
    </main>
  );
};
