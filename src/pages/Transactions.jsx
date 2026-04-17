import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const Transactions = () => {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("categoryId");

  const [filters, setFilters] = useState({
    search: "",
    type: "",
    categoryId: categoryId || "",
    fromDate: "",
    toDate: "",
    minAmount: "",
    maxAmount: "",
  });

  const [sort, setSort] = useState({
    field: "date",
    order: "desc",
  });

  // ✅ FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [resT, resC] = await Promise.all([
          fetch("http://localhost:3000/transactions"),
          fetch("http://localhost:3000/categories"),
        ]);

        const dataT = await resT.json();
        const dataC = await resC.json();

        setTransactions(dataT);
        setCategories(dataC);
      } catch (err) {
        console.log(err);
        alert("❌ Lỗi load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ HANDLE FILTER
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ FILTER + SORT
  const filteredTransactions = transactions
    .filter((t) => {
      if (
        filters.search &&
        !t.description.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;

      if (filters.type && t.type !== filters.type) return false;

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
      let A = a[sort.field];
      let B = b[sort.field];

      if (sort.field === "date") {
        A = new Date(A);
        B = new Date(B);
      }

      return sort.order === "asc" ? (A > B ? 1 : -1) : A < B ? 1 : -1;
    });

  // ✅ CATEGORY MAP
  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));

  const getCategoryName = (id) => categoryMap[id] || "Unknown";

  // ✅ DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có muốn xóa không?")) return;

    try {
      await fetch(`http://localhost:3000/transactions/${id}`, {
        method: "DELETE",
      });

      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.log(err);
      alert("❌ Lỗi delete");
    }
  };

  // ✅ LOADING
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl">
        ⏳ Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-24xl mx-auto space-y-6">
        {/* HEADER */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            {categoryId
              ? `Transactions - ${getCategoryName(categoryId)}`
              : "Transactions"}
          </h2>
          <p className="text-gray-500 text-sm">
            Review and manage your transactions
          </p>
        </div>

        {/* FILTER */}
        <div className="bg-white p-6 rounded-2xl shadow-md space-y-5">
          <h3 className="font-semibold text-gray-700 text-lg">🔍 Filters</h3>

          {/* 🔎 SEARCH FULL WIDTH */}
          <div>
            <input
              name="search"
              placeholder="🔎 Tìm kiếm theo mô tả..."
              value={filters.search}
              onChange={handleFilterChange}
              className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* 🎯 FILTER GROUP 1 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* TYPE */}
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="border px-4 py-3 rounded-xl"
            >
              <option value="">All Type</option>
              <option value="income">💰 Income</option>
              <option value="expense">💸 Expense</option>
            </select>

            {/* CATEGORY */}
            <select
              name="categoryId"
              value={filters.categoryId}
              onChange={handleFilterChange}
              className="border px-4 py-3 rounded-xl"
            >
              <option value="">All Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* SORT FIELD */}
            <select
              value={sort.field}
              onChange={(e) =>
                setSort((prev) => ({ ...prev, field: e.target.value }))
              }
              className="border px-4 py-3 rounded-xl"
            >
              <option value="date">📅 Sort by Date</option>
              <option value="amount">💰 Sort by Amount</option>
            </select>

            {/* SORT ORDER */}
            <select
              value={sort.order}
              onChange={(e) =>
                setSort((prev) => ({ ...prev, order: e.target.value }))
              }
              className="border px-4 py-3 rounded-xl"
            >
              <option value="desc">⬇ Desc</option>
              <option value="asc">⬆ Asc</option>
            </select>
          </div>

          {/* 🎯 FILTER GROUP 2 (range) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="date"
              name="fromDate"
              value={filters.fromDate}
              onChange={handleFilterChange}
              className="border px-4 py-3 rounded-xl"
            />

            <input
              type="date"
              name="toDate"
              value={filters.toDate}
              onChange={handleFilterChange}
              className="border px-4 py-3 rounded-xl"
            />

            <input
              type="number"
              name="minAmount"
              placeholder="💰 Min amount"
              value={filters.minAmount}
              onChange={handleFilterChange}
              className="border px-4 py-3 rounded-xl"
            />

            <input
              type="number"
              name="maxAmount"
              placeholder="💰 Max amount"
              value={filters.maxAmount}
              onChange={handleFilterChange}
              className="border px-4 py-3 rounded-xl"
            />
          </div>

          {/* ACTION */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-400">⚡ Filter dữ liệu realtime</p>

            <button
              onClick={() =>
                setFilters({
                  search: "",
                  type: "",
                  categoryId: "",
                  fromDate: "",
                  toDate: "",
                  minAmount: "",
                  maxAmount: "",
                })
              }
              className="bg-gray-200 px-5 py-2 rounded-xl hover:bg-gray-300 transition"
            >
              Reset
            </button>
          </div>
        </div>
        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.map((t) => (
                <tr key={t.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {new Date(t.date).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 font-medium">{t.description}</td>

                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs">
                      {getCategoryName(t.categoryId)}
                    </span>
                  </td>

                  <td className="px-6 py-4 font-bold">
                    <span
                      className={
                        t.type === "income" ? "text-green-600" : "text-red-600"
                      }
                    >
                      {t.type === "income" ? "+" : "-"}
                      {t.amount.toLocaleString()} đ
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {t.type === "income" ? "💰" : "💸"}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      className="text-blue-500 hover:text-blue-700 mr-3"
                      onClick={() => navigate(`/edit/${t.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(t.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="px-6 py-4 text-sm text-gray-500">
            Total: {filteredTransactions.length} transactions
          </div>
        </div>
      </div>
    </main>
  );
};
