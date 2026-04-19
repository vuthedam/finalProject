import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const IncomeCategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  const [form, setForm] = useState({ name: "", userId });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3000/incomeCategories/${id}`)
        .then((r) => r.json())
        .then((data) => setForm(data));
    }
  }, [id]);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Yêu cầu nhập tên";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = { ...form, userId };

    try {
      if (id) {
        await fetch(`http://localhost:3000/incomeCategories/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("http://localhost:3000/incomeCategories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      navigate("/income/categories");
    } catch (err) {
      alert("❌ Lỗi lưu danh mục");
    }
  };

  return (
    <main className="min-h-screen bg-[#f7fbf8] px-4 py-10 md:px-6">
      <div className="mx-auto w-full max-w-2xl">
        <div className="rounded-[36px] border border-emerald-50 bg-white/85 p-8 shadow-[0_24px_80px_rgba(16,185,129,0.06)] backdrop-blur-xl sm:p-10">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Income Category
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
              {id ? "Chỉnh sửa danh mục thu nhập" : "Tạo danh mục thu nhập"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {id
                ? "Cập nhật danh mục thu nhập để quản lý nguồn tiền tốt hơn."
                : "Thêm một danh mục mới như lương, freelance hoặc đầu tư."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Tên danh mục
              </label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="VD: Lương, Freelance..."
                className="w-full rounded-3xl border border-transparent bg-emerald-50/60 px-5 py-[18px] text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 hover:bg-white focus:border-emerald-200 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />
              {errors.name && (
                <p className="mt-2 text-sm font-medium text-rose-500">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate("/income/categories")}
                className="rounded-3xl border border-emerald-100 bg-emerald-50/50 px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-white"
              >
                Hủy
              </button>

              <button
                type="submit"
                className="rounded-3xl bg-gradient-to-r from-emerald-300 to-green-400 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:opacity-95"
              >
                {id ? "Cập nhật" : "Tạo mới"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};
