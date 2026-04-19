import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const IncomeTransactionForm = () => {
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
    fetch(`http://localhost:3000/incomeCategories?userId=${userId}`)
      .then((r) => r.json())
      .then(setCategories);

    if (id) {
      fetch(`http://localhost:3000/incomes/${id}`)
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
      await fetch(`http://localhost:3000/incomes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("http://localhost:3000/incomes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    navigate("/income/transactions");
  };

  return (
    <main className="min-h-screen bg-[#f7fbf8] px-4 py-10 md:px-6">
      <div className="mx-auto w-full max-w-2xl">
        <div className="rounded-[36px] border border-emerald-50 bg-white/85 p-8 shadow-[0_24px_80px_rgba(16,185,129,0.06)] backdrop-blur-xl sm:p-10">
          {/* HEADER */}
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Income Transaction
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">
              {id ? "Chỉnh sửa giao dịch" : "Thêm giao dịch thu"}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Nhập thông tin thu nhập của bạn
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Mô tả
              </label>
              <input
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="VD: Lương tháng 5..."
                className="w-full rounded-3xl bg-emerald-50/60 px-5 py-[18px] text-sm outline-none focus:ring-4 focus:ring-emerald-100"
              />
              {errors.description && (
                <p className="text-rose-500 text-sm mt-2">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Số tiền
              </label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) =>
                  setForm((p) => ({ ...p, amount: e.target.value }))
                }
                placeholder="0"
                className="w-full rounded-3xl bg-emerald-50/60 px-5 py-[18px] outline-none focus:ring-4 focus:ring-emerald-100"
              />
              {errors.amount && (
                <p className="text-rose-500 text-sm mt-2">{errors.amount}</p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Ngày
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((p) => ({ ...p, date: e.target.value }))
                }
                className="w-full rounded-3xl bg-emerald-50/60 px-5 py-[18px] outline-none focus:ring-4 focus:ring-emerald-100"
              />
              {errors.date && (
                <p className="text-rose-500 text-sm mt-2">{errors.date}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Danh mục
              </label>
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
              {errors.categoryId && (
                <p className="text-rose-500 text-sm mt-2">
                  {errors.categoryId}
                </p>
              )}
            </div>

            {/* ACTION */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/income/transactions")}
                className="px-6 py-3 rounded-3xl bg-emerald-50 text-slate-700 font-semibold"
              >
                Hủy
              </button>

              <button className="px-6 py-3 rounded-3xl bg-gradient-to-r from-emerald-300 to-green-400 text-white font-semibold shadow-md">
                {id ? "Cập nhật" : "Tạo mới"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};
