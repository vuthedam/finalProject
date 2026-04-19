import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const IncomeTransactions = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = JSON.parse(localStorage.getItem("user"))?.id;
  const categoryIdFromUrl = searchParams.get("categoryId");

  const [filters, setFilters] = useState({
    search: "",
    categoryId: categoryIdFromUrl || "",
    fromDate: "",
    toDate: "",
    minAmount: "",
    maxAmount: "",
  });

  const [sort, setSort] = useState({
    field: "date",
    order: "desc",
  });

  const fetchData = async () => {
    try {
      setLoading(true);

      const [resT, resC] = await Promise.all([
        fetch(`http://localhost:3000/incomes?userId=${userId}`),
        fetch(`http://localhost:3000/incomeCategories?userId=${userId}`),
      ]);

      setTransactions(await resT.json());
      setCategories(await resC.json());
    } catch (err) {
      alert("❌ Lỗi load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((p) => ({ ...p, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      categoryId: "",
      fromDate: "",
      toDate: "",
      minAmount: "",
      maxAmount: "",
    });
  };

  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c.name])),
    [categories],
  );

  const filtered = useMemo(() => {
    return [...transactions]
      .filter((t) => {
        if (
          filters.search &&
          !String(t.description || "")
            .toLowerCase()
            .includes(filters.search.toLowerCase())
        )
          return false;

        if (filters.categoryId && t.categoryId != filters.categoryId)
          return false;

        if (filters.fromDate && t.date < filters.fromDate) return false;
        if (filters.toDate && t.date > filters.toDate) return false;

        if (filters.minAmount && t.amount < Number(filters.minAmount))
          return false;

        if (filters.maxAmount && t.amount > Number(filters.maxAmount))
          return false;

        return true;
      })
      .sort((a, b) => {
        const A =
          sort.field === "date" ? new Date(a.date) : Number(a[sort.field]);
        const B =
          sort.field === "date" ? new Date(b.date) : Number(b[sort.field]);

        return sort.order === "asc" ? (A > B ? 1 : -1) : A < B ? 1 : -1;
      });
  }, [transactions, filters, sort]);

  const total = filtered.reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có muốn xóa không?")) return;

    await fetch(`http://localhost:3000/incomes/${id}`, {
      method: "DELETE",
    });

    setTransactions((prev) => prev.filter((t) => t.id !== id));
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
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <p className="text-sm uppercase tracking-widest text-emerald-600 font-semibold">
              Income
            </p>
            <h2 className="text-3xl font-black text-slate-900">Transactions</h2>
          </div>

          <button
            onClick={() => navigate("/income/transactions/create")}
            className="rounded-2xl bg-gradient-to-r from-emerald-300 to-green-400 px-5 py-3 text-white font-semibold shadow-sm"
          >
            + Add Transaction
          </button>
        </div>

        {/* FILTER */}
        <div className="bg-white/80 border border-emerald-50 rounded-3xl p-6 space-y-4 shadow-sm">
          <input
            name="search"
            placeholder="Tìm kiếm..."
            value={filters.search}
            onChange={handleFilterChange}
            className="w-full rounded-3xl bg-emerald-50/60 px-5 py-3 outline-none focus:ring-4 focus:ring-emerald-100"
          />

          <div className="grid md:grid-cols-3 gap-4">
            <select
              name="categoryId"
              value={filters.categoryId}
              onChange={handleFilterChange}
              className="rounded-3xl bg-emerald-50/60 px-5 py-3"
            >
              <option value="">All Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={sort.field}
              onChange={(e) =>
                setSort((p) => ({ ...p, field: e.target.value }))
              }
              className="rounded-3xl bg-emerald-50/60 px-5 py-3"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
            </select>

            <select
              value={sort.order}
              onChange={(e) =>
                setSort((p) => ({ ...p, order: e.target.value }))
              }
              className="rounded-3xl bg-emerald-50/60 px-5 py-3"
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <input
              type="date"
              name="fromDate"
              value={filters.fromDate}
              onChange={handleFilterChange}
              className="rounded-3xl bg-emerald-50/60 px-5 py-3"
            />
            <input
              type="date"
              name="toDate"
              value={filters.toDate}
              onChange={handleFilterChange}
              className="rounded-3xl bg-emerald-50/60 px-5 py-3"
            />
            <input
              type="number"
              name="minAmount"
              placeholder="Min"
              value={filters.minAmount}
              onChange={handleFilterChange}
              className="rounded-3xl bg-emerald-50/60 px-5 py-3"
            />
            <input
              type="number"
              name="maxAmount"
              placeholder="Max"
              value={filters.maxAmount}
              onChange={handleFilterChange}
              className="rounded-3xl bg-emerald-50/60 px-5 py-3"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={resetFilters}
              className="px-5 py-2 rounded-2xl bg-emerald-50 text-slate-700"
            >
              Reset
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white/80 border border-emerald-50 rounded-[32px] shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#f8fcf9] text-slate-500">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-t hover:bg-[#f8fcf9]">
                  <td className="px-6 py-4">
                    {new Date(t.date).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 font-medium">{t.description}</td>

                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs">
                      {categoryMap[t.categoryId]}
                    </span>
                  </td>

                  <td className="px-6 py-4 font-bold text-emerald-600">
                    +{t.amount.toLocaleString()} đ
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      className="text-emerald-600 mr-3"
                      onClick={() =>
                        navigate(`/income/transactions/${t.id}/edit`)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="text-rose-500"
                      onClick={() => handleDelete(t.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="px-6 py-4 text-sm text-slate-500">
            Total: {filtered.length} transactions | {total.toLocaleString()} đ
          </div>
        </div>
      </div>
    </main>
  );
};
