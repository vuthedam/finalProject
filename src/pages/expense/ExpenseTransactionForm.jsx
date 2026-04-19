import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const ExpenseTransactionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  const [form, setForm] = useState({
    description: "",
    amount: "",
    date: "",
    categoryId: "",
    userId,
  });

  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch(`http://localhost:3000/expenseCategories?userId=${userId}`)
      .then((r) => r.json())
      .then(setCategories);

    if (id) {
      fetch(`http://localhost:3000/expenses/${id}`)
        .then((r) => r.json())
        .then((data) =>
          setForm({
            ...data,
            amount: String(data.amount),
            categoryId: String(data.categoryId),
          }),
        );
    }
  }, [id]);

  const validate = () => {
    const newErrors = {};
    if (!form.description.trim()) newErrors.description = "Yêu cầu nhập mô tả";
    if (!form.date) newErrors.date = "Yêu cầu nhập ngày";
    if (!form.amount || Number(form.amount) <= 0)
      newErrors.amount = "Số tiền phải > 0";
    if (!form.categoryId) newErrors.categoryId = "Chọn danh mục";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...form,
      amount: Number(form.amount),
      categoryId: Number(form.categoryId),
    };

    if (id) {
      await fetch(`http://localhost:3000/expenses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("http://localhost:3000/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    navigate("/expense/transactions");
  };

  return (
    <main className="min-h-screen bg-[#f7fbf8] px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-[36px] border border-emerald-50 bg-white/85 p-8 shadow-sm backdrop-blur-xl">
          <h2 className="text-3xl font-black text-slate-900 mb-6">
            {id ? "Chỉnh sửa giao dịch" : "Thêm giao dịch chi tiêu"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Description */}
            <input
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="Mô tả..."
              className="w-full rounded-3xl bg-emerald-50/60 px-5 py-[18px] outline-none focus:ring-4 focus:ring-emerald-100"
            />
            {errors.description && (
              <p className="text-rose-500 text-sm">{errors.description}</p>
            )}

            {/* Amount */}
            <input
              type="number"
              value={form.amount}
              onChange={(e) =>
                setForm((p) => ({ ...p, amount: e.target.value }))
              }
              placeholder="Số tiền"
              className="w-full rounded-3xl bg-emerald-50/60 px-5 py-[18px] outline-none focus:ring-4 focus:ring-emerald-100"
            />
            {errors.amount && (
              <p className="text-rose-500 text-sm">{errors.amount}</p>
            )}

            {/* Date */}
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
              className="w-full rounded-3xl bg-emerald-50/60 px-5 py-[18px] outline-none focus:ring-4 focus:ring-emerald-100"
            />
            {errors.date && (
              <p className="text-rose-500 text-sm">{errors.date}</p>
            )}

            {/* Category */}
            <select
              value={form.categoryId}
              onChange={(e) =>
                setForm((p) => ({ ...p, categoryId: e.target.value }))
              }
              className="w-full rounded-3xl bg-emerald-50/60 px-5 py-[18px]"
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/expense/transactions")}
                className="px-5 py-3 rounded-3xl bg-emerald-50 text-slate-700"
              >
                Hủy
              </button>

              <button className="px-5 py-3 rounded-3xl bg-emerald-400 text-white">
                {id ? "Cập nhật" : "Tạo"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};
