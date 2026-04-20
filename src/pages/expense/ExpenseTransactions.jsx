import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const ExpenseTransactions = () => {
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

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const fetchData = async () => {
    try {
      setLoading(true);

      const [resT, resC] = await Promise.all([
        fetch(`http://localhost:3000/expenses?userId=${userId}`),
        fetch(`http://localhost:3000/expenseCategories?userId=${userId}`),
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
  }, [userId]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
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
        ) {
          return false;
        }

        if (filters.categoryId && t.categoryId != filters.categoryId) {
          return false;
        }

        if (filters.fromDate && t.date < filters.fromDate) {
          return false;
        }

        if (filters.toDate && t.date > filters.toDate) {
          return false;
        }

        if (filters.minAmount && Number(t.amount) < Number(filters.minAmount)) {
          return false;
        }

        if (filters.maxAmount && Number(t.amount) > Number(filters.maxAmount)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const A =
          sort.field === "date"
            ? new Date(a[sort.field])
            : Number(a[sort.field] || 0);
        const B =
          sort.field === "date"
            ? new Date(b[sort.field])
            : Number(b[sort.field] || 0);

        return sort.order === "asc" ? (A > B ? 1 : -1) : A < B ? 1 : -1;
      });
  }, [transactions, filters, sort]);

  const totalFilteredAmount = filtered.reduce(
    (sum, t) => sum + Number(t.amount || 0),
    0,
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  React.useEffect(() => { setPage(1); }, [filters, sort]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có muốn xóa không?")) return;

    try {
      await fetch(`http://localhost:3000/expenses/${id}`, {
        method: "DELETE",
      });

      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert("❌ Lỗi delete");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7fbf8]">
        <div className="rounded-3xl border border-emerald-50 bg-white/80 px-8 py-6 text-lg font-semibold text-slate-600 shadow-sm">
          ⏳ Đang tải giao dịch...
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
              Expense
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">
              Transactions
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Quản lý các khoản chi tiêu của bạn
            </p>
          </div>

          <button
            onClick={() => navigate("/expense/transactions/create")}
            className="rounded-2xl bg-gradient-to-r from-emerald-300 to-green-400 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
          >
            + Add Transaction
          </button>
        </div>

        {/* Summary cards */}
        <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="rounded-[30px] border border-emerald-50 bg-white/80 p-6 shadow-sm">
            <p className="text-sm text-slate-500">Tổng giao dịch</p>
            <h3 className="mt-2 text-3xl font-black text-slate-900">
              {filtered.length}
            </h3>
          </div>

          <div className="rounded-[30px] border border-emerald-50 bg-white/80 p-6 shadow-sm">
            <p className="text-sm text-slate-500">Tổng chi đã lọc</p>
            <h3 className="mt-2 text-3xl font-black text-rose-500">
              {totalFilteredAmount.toLocaleString()} đ
            </h3>
          </div>

          <div className="rounded-[30px] border border-emerald-50 bg-white/80 p-6 shadow-sm">
            <p className="text-sm text-slate-500">Số danh mục</p>
            <h3 className="mt-2 text-3xl font-black text-emerald-500">
              {categories.length}
            </h3>
          </div>
        </section>

        {/* Filters */}
        <div className="rounded-[32px] border border-emerald-50 bg-white/80 p-6 shadow-sm">
          <div className="mb-5">
            <h3 className="text-lg font-bold text-slate-900">
              Bộ lọc giao dịch
            </h3>
            <p className="text-sm text-slate-500">
              Tìm kiếm, lọc theo danh mục, ngày và khoảng tiền
            </p>
          </div>

          <div className="space-y-4">
            <input
              name="search"
              placeholder="Tìm kiếm theo mô tả..."
              value={filters.search}
              onChange={handleFilterChange}
              className="w-full rounded-3xl border border-transparent bg-emerald-50/60 px-5 py-3.5 text-sm outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <select
                name="categoryId"
                value={filters.categoryId}
                onChange={handleFilterChange}
                className="w-full rounded-3xl border border-transparent bg-emerald-50/60 px-5 py-3.5 text-sm outline-none transition-all focus:bg-white focus:ring-4 focus:ring-emerald-100"
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
                  setSort((prev) => ({ ...prev, field: e.target.value }))
                }
                className="w-full rounded-3xl border border-transparent bg-emerald-50/60 px-5 py-3.5 text-sm outline-none transition-all focus:bg-white focus:ring-4 focus:ring-emerald-100"
              >
                <option value="date">Sort by Date</option>
                <option value="amount">Sort by Amount</option>
              </select>

              <select
                value={sort.order}
                onChange={(e) =>
                  setSort((prev) => ({ ...prev, order: e.target.value }))
                }
                className="w-full rounded-3xl border border-transparent bg-emerald-50/60 px-5 py-3.5 text-sm outline-none transition-all focus:bg-white focus:ring-4 focus:ring-emerald-100"
              >
                <option value="desc">Desc</option>
                <option value="asc">Asc</option>
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <input
                type="date"
                name="fromDate"
                value={filters.fromDate}
                onChange={handleFilterChange}
                className="w-full rounded-3xl border border-transparent bg-emerald-50/60 px-5 py-3.5 text-sm outline-none transition-all focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />

              <input
                type="date"
                name="toDate"
                value={filters.toDate}
                onChange={handleFilterChange}
                className="w-full rounded-3xl border border-transparent bg-emerald-50/60 px-5 py-3.5 text-sm outline-none transition-all focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />

              <input
                type="number"
                name="minAmount"
                placeholder="Min amount"
                value={filters.minAmount}
                onChange={handleFilterChange}
                className="w-full rounded-3xl border border-transparent bg-emerald-50/60 px-5 py-3.5 text-sm outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />

              <input
                type="number"
                name="maxAmount"
                placeholder="Max amount"
                value={filters.maxAmount}
                onChange={handleFilterChange}
                className="w-full rounded-3xl border border-transparent bg-emerald-50/60 px-5 py-3.5 text-sm outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={resetFilters}
                className="rounded-2xl border border-emerald-100 bg-emerald-50/50 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-white"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-[32px] border border-emerald-50 bg-white/80 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-[#f8fcf9] text-slate-500">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Date</th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">Amount</th>
                  <th className="px-6 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.length > 0 ? (
                  paginated.map((t) => (
                    <tr
                      key={t.id}
                      className="border-b border-slate-100 transition hover:bg-[#f8fcf9]"
                    >
                      <td className="px-6 py-4 text-slate-600">
                        {new Date(t.date).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4 font-medium text-slate-900">
                        {t.description}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                          {categoryMap[t.categoryId] || "Unknown"}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-bold text-rose-500">
                        -{Number(t.amount || 0).toLocaleString()} đ
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          className="mr-4 font-medium text-emerald-600 transition hover:underline"
                          onClick={() =>
                            navigate(`/expense/transactions/${t.id}/edit`)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="font-medium text-rose-500 transition hover:underline"
                          onClick={() => handleDelete(t.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-10 text-center text-sm text-slate-400"
                    >
                      Không có giao dịch nào phù hợp
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-between flex-wrap gap-3">
            <span className="text-sm text-slate-500">
              {filtered.length} transactions | {totalFilteredAmount.toLocaleString()} đ
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(1)} disabled={page === 1}
                className="px-2 py-1 rounded-lg text-sm disabled:opacity-30 hover:bg-emerald-50">«</button>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1 rounded-lg text-sm disabled:opacity-30 hover:bg-emerald-50">‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce((acc, p, i, arr) => {
                  if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "..." ? (
                    <span key={i} className="px-2 text-slate-400">...</span>
                  ) : (
                    <button key={p} onClick={() => setPage(p)}
                      className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                        page === p ? "bg-emerald-500 text-white" : "hover:bg-emerald-50 text-slate-600"
                      }`}>{p}</button>
                  )
                )}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-3 py-1 rounded-lg text-sm disabled:opacity-30 hover:bg-emerald-50">›</button>
              <button onClick={() => setPage(totalPages)} disabled={page === totalPages}
                className="px-2 py-1 rounded-lg text-sm disabled:opacity-30 hover:bg-emerald-50">»</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
