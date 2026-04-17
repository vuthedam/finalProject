import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export const Add_EditTransactions = () => {
  const [categories, setCategories] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    amount: "",
    type: "expense",
    description: "",
    date: "",
    categoryId: "",
    userId: 1,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:3000/categories")
      .then((res) => setCategories(res.data));

    if (id) {
      axios
        .get(`http://localhost:3000/transactions/${id}`)
        .then((res) => {
          setForm({
            ...res.data,
            amount: res.data.amount.toString(),
            categoryId: res.data.categoryId.toString(),
          });
        })
        .catch((err) => console.log(err));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const validate = () => {
    let newErrors = {};

    if (!form.description.trim()) {
      newErrors.description = "Yêu cầu nhập mô tả ";
    }

    if (!form.date) {
      newErrors.date = "Yêu cầu nhập ngày";
    } else {
      const today = new Date().toLocaleDateString("en-CA");

      if (form.date > today) {
        newErrors.date = "Không được nhập ngày trong tương lai";
      }
    }
    if (!form.amount) {
      newErrors.amount = "Yêu cầu nhập số tiền";
    } else if (isNaN(form.amount) || Number(form.amount) <= 0) {
      newErrors.amount = "Số tiền phải là số dương";
    }
    if (!form.categoryId) {
      newErrors.categoryId = "Yêu cầu chọn danh mục";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      ...form,
      amount: Number(form.amount),
      categoryId: Number(form.categoryId),
    };

    try {
      if (id) {
        await axios.put(`http://localhost:3000/transactions/${id}`, payload);
        alert("✅ Update thành công");
      } else {
        await axios.post("http://localhost:3000/transactions", payload);
        alert("✅ Add thành công");
      }

      navigate("/transactions");
    } catch (error) {
      console.log(error);
      alert("❌ Lỗi");
    }
  };
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex justify-center py-12 px-4">
      <div className="w-full  bg-white rounded-2xl shadow-xl p-8">
        {/* HEADER */}
        <div className="mb-8 border-b pb-4">
          <h2 className="text-3xl font-bold text-slate-800">TransactionForm</h2>
          <p className="text-sm text-slate-500 mt-1">
            Track your income and expenses easily
          </p>
        </div>

        {/* FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT */}
          <div className="space-y-6">
            {/* DESCRIPTION */}
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">
                Description
              </label>
              <input
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="e.g. Salary, Coffee..."
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* AMOUNT */}
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">
                Amount
              </label>
              <input
                name="amount"
                type="number"
                value={form.amount}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              {errors.amount && (
                <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
              )}
            </div>

            {/* TYPE */}
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">
                Type
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              >
                <option value="expense">💸 Expense</option>
                <option value="income">💰 Income</option>
              </select>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            {/* DATE */}
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">
                Date
              </label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>

            {/* CATEGORY */}
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">
                Category
              </label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select Category --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>
              )}
            </div>

            {/* INFO */}
            <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-xl text-sm">
              💡 Tip: Income = tiền vào, Expense = tiền ra
            </div>
          </div>
        </div>

        {/* BUTTON */}
        <div className="mt-10 flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg transition"
          >
            {id ? "Update Transaction" : "+ Add Transaction"}
          </button>
        </div>
      </div>
    </main>
  );
};
