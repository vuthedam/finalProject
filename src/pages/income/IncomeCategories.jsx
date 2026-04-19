import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const IncomeCategories = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  const fetchData = async () => {
    try {
      setLoading(true);

      const [cateRes, transRes] = await Promise.all([
        fetch(`http://localhost:3000/incomeCategories?userId=${userId}`),
        fetch(`http://localhost:3000/incomes?userId=${userId}`),
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

  const earnedByCategory = (id) =>
    transactions
      .filter((t) => t.categoryId == id)
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalIncome = transactions.reduce(
    (sum, t) => sum + Number(t.amount || 0),
    0,
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa danh mục này?")) return;

    if (transactions.some((t) => t.categoryId == id)) {
      return alert("Danh mục này còn transaction!");
    }

    await fetch(`http://localhost:3000/incomeCategories/${id}`, {
      method: "DELETE",
    });

    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7fbf8]">
        <div className="rounded-3xl bg-white px-6 py-4 shadow-sm text-slate-600">
          ⏳ Loading...
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7fbf8]">
      <div className="space-y-6 p-6 md:p-8">
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Income
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">
              Categories
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Quản lý danh mục thu nhập
            </p>
          </div>

          <button
            onClick={() => navigate("/income/categories/create")}
            className="rounded-2xl bg-gradient-to-r from-emerald-300 to-green-400 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-95"
          >
            + Add Category
          </button>
        </div>

        {/* STATS */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white/80 border border-emerald-50 rounded-3xl p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Categories</p>
            <h2 className="text-3xl font-black mt-2">{categories.length}</h2>
          </div>

          <div className="bg-white/80 border border-emerald-50 rounded-3xl p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Income</p>
            <h2 className="text-3xl font-black text-emerald-500 mt-2">
              {totalIncome.toLocaleString()} đ
            </h2>
          </div>
        </section>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Tìm kiếm danh mục..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm rounded-3xl bg-emerald-50/60 px-5 py-3 text-sm outline-none border border-transparent focus:bg-white focus:ring-4 focus:ring-emerald-100"
        />

        {/* TABLE */}
        <div className="bg-white/80 border border-emerald-50 rounded-[32px] shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f8fcf9] text-slate-500">
                <th className="px-6 py-4 text-left">Category</th>
                <th className="px-6 py-4 text-left">Đã thu</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCategories.map((c) => (
                <tr
                  key={c.id}
                  className="border-t hover:bg-[#f8fcf9] transition"
                >
                  <td className="px-6 py-4 font-semibold text-emerald-600">
                    <Link to={`/income/transactions?categoryId=${c.id}`}>
                      {c.name}
                    </Link>
                  </td>

                  <td className="px-6 py-4 text-emerald-500 font-semibold">
                    {earnedByCategory(c.id).toLocaleString()} đ
                  </td>

                  <td className="px-6 py-4 text-right space-x-3">
                    <button
                      onClick={() =>
                        navigate(`/income/categories/${c.id}/edit`)
                      }
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
              ))}

              {filteredCategories.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-8 text-slate-400">
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
