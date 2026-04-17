import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("expense");
  const [budget, setBudget] = useState("");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

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
      alert("❌ Lỗi load data");
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = useMemo(() => {
    let result = [...categories];

    const keyword = search.trim().toLowerCase();

    if (keyword) {
      result = result.filter((c) =>
        c.name?.trim().toLowerCase().includes(keyword),
      );
    }

    if (filterType !== "all") {
      result = result.filter((c) => c.type === filterType);
    }

    return result;
  }, [categories, search, filterType]);

  const resetForm = () => {
    setName("");
    setType("expense");
    setBudget("");
    setEditingId(null);
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setType(newType);

    if (newType === "income") {
      setBudget("0");
    } else if (budget === "0") {
      setBudget("");
    }
  };

  const handleAdd = async () => {
    if (!name.trim()) return alert("Nhập tên danh mục!");

    const normalizedName = name.trim().toLowerCase();

    const isDuplicate = categories.some(
      (c) => c.name.trim().toLowerCase() === normalizedName,
    );

    if (isDuplicate) {
      return alert("❌ Tên danh mục đã tồn tại!");
    }

    if (type === "expense" && (budget === "" || Number(budget) < 0)) {
      return alert("Nhập budget hợp lệ!");
    }

    const finalBudget = type === "income" ? 0 : Number(budget);

    try {
      await fetch("http://localhost:3000/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          type,
          budget: finalBudget,
          userId: 1,
        }),
      });

      resetForm();
      fetchData();
    } catch (err) {
      console.log(err);
      alert("❌ Lỗi thêm danh mục");
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setName(category.name);
    setType(category.type || "expense");
    setBudget(category.type === "income" ? "0" : String(category.budget ?? ""));
  };

  const handleUpdate = async () => {
    if (!name.trim()) return alert("Nhập tên danh mục!");

    const normalizedName = name.trim().toLowerCase();

    const isDuplicate = categories.some(
      (c) =>
        c.name.trim().toLowerCase() === normalizedName && c.id !== editingId,
    );

    if (isDuplicate) {
      return alert("❌ Tên danh mục đã tồn tại!");
    }

    if (type === "expense" && (budget === "" || Number(budget) < 0)) {
      return alert("Nhập budget hợp lệ!");
    }

    const finalBudget = type === "income" ? 0 : Number(budget);

    try {
      await fetch(`http://localhost:3000/categories/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingId,
          name: name.trim(),
          type,
          budget: finalBudget,
          userId: 1,
        }),
      });

      resetForm();
      fetchData();
    } catch (err) {
      console.log(err);
      alert("❌ Lỗi cập nhật danh mục");
    }
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa danh mục này?")) return;

    const relatedTransactions = transactions.filter((t) => t.categoryId == id);

    if (relatedTransactions.length > 0) {
      alert(
        `Danh mục này còn ${relatedTransactions.length} transaction nên chưa xóa được!`,
      );
      return;
    }

    try {
      await fetch(`http://localhost:3000/categories/${id}`, {
        method: "DELETE",
      });

      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.log(err);
      alert("❌ Lỗi xóa danh mục");
    }
  };

  const spentByCategory = (id) => {
    return transactions
      .filter((t) => t.categoryId == id && t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalBudget = categories
    .filter((c) => c.type === "expense")
    .reduce((sum, c) => sum + Number(c.budget || 0), 0);

  const remaining = totalBudget - totalExpense;

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl">
        ⏳ Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-surface-container-low">
      <div className="pt-24 px-8 pb-12">
        <div className="flex justify-between items-end mb-8 gap-4 flex-wrap">
          <div>
            <h2 className="text-3xl font-bold">Category Explorer</h2>
            <p className="text-gray-400 text-sm">Manage your categories</p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <input
              className="border px-4 py-2 rounded-full"
              placeholder="Tên danh mục..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <select
              className="border px-4 py-2 rounded-full"
              value={type}
              onChange={handleTypeChange}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <input
              type="number"
              disabled={type === "income"}
              className={`border px-4 py-2 rounded-full ${
                type === "income"
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : ""
              }`}
              placeholder={
                type === "income" ? "Income không cần budget" : "Budget..."
              }
              value={type === "income" ? "" : budget}
              onChange={(e) => setBudget(e.target.value)}
            />

            {editingId ? (
              <>
                <button
                  onClick={handleUpdate}
                  className="bg-blue-600 text-white px-6 rounded-full"
                >
                  Update
                </button>

                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-400 text-white px-6 rounded-full"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleAdd}
                className="bg-black text-white px-6 rounded-full"
              >
                + Add
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-3 flex-wrap mb-6">
          <input
            type="text"
            className="border px-4 py-2 rounded-full w-72"
            placeholder="Tìm kiếm danh mục..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border px-4 py-2 rounded-full"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-xs text-gray-400">Active Categories</p>
            <h2 className="text-2xl font-bold">{filteredCategories.length}</h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-xs text-gray-400">Total Income</p>
            <h2 className="text-2xl text-green-500 font-bold">
              {totalIncome.toLocaleString()} đ
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-xs text-gray-400">Total Expense</p>
            <h2 className="text-2xl text-red-500 font-bold">
              {totalExpense.toLocaleString()} đ
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-xs text-gray-400">Total Budget</p>
            <h2 className="text-2xl text-blue-500 font-bold">
              {totalBudget.toLocaleString()} đ
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-xs text-gray-400">Remaining</p>
            <h2 className="text-2xl text-purple-500 font-bold">
              {remaining.toLocaleString()} đ
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase">
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Type</th>
                <th className="px-6 py-3 text-left">Budget</th>
                <th className="px-6 py-3 text-left">Đã chi</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCategories.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 border-t">
                  <td className="px-6 py-4">
                    <Link
                      to={`/transactions?categoryId=${c.id}`}
                      className="font-bold text-blue-600 hover:underline"
                    >
                      {c.name}
                    </Link>
                  </td>

                  <td className="px-6 py-4">
                    {c.type === "income" ? "🟢 Income" : "🔴 Expense"}
                  </td>

                  <td className="px-6 py-4">
                    {c.type === "expense"
                      ? `${Number(c.budget || 0).toLocaleString()} đ`
                      : "-"}
                  </td>

                  <td className="px-6 py-4">
                    {c.type === "expense"
                      ? `${spentByCategory(c.id).toLocaleString()} đ`
                      : "-"}
                  </td>

                  <td className="px-6 py-4 text-right space-x-3">
                    <button
                      onClick={() => handleEdit(c)}
                      className="text-blue-500"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredCategories.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-400">
                    Không tìm thấy danh mục nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="px-6 py-4 border-t text-sm text-gray-500">
            Total: {filteredCategories.length} categories
          </div>
        </div>
      </div>
    </main>
  );
};
