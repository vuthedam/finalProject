import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import api from "../api";

const registerSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
  fullname: z.string().min(3, "Họ tên tối thiểu 3 ký tự"),
});

export const Register = () => {
  const nav = useNavigate();

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      await api.post("/auth/register", data);
      toast.success("Đăng ký thành công");
      nav("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Đăng ký thất bại!");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7fbf8] text-slate-800">
      <div className="grid min-h-screen lg:grid-cols-[1fr_1fr]">
        {/* LEFT */}
        <section className="relative hidden overflow-hidden bg-[#eef7f1] lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.08),transparent_28%),radial-gradient(circle_at_80%_75%,rgba(132,204,22,0.08),transparent_24%)]" />
          <div className="absolute -top-10 left-10 h-56 w-56 rounded-full bg-emerald-200/50 blur-3xl" />
          <div className="absolute bottom-10 right-0 h-72 w-72 rounded-full bg-lime-100/60 blur-3xl" />
          <div className="absolute right-16 top-20 h-28 w-28 rounded-[32px] bg-white/40 backdrop-blur-md" />
          <div className="absolute bottom-16 left-16 h-20 w-20 rounded-[28px] bg-emerald-100/70" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            <div>
              <div className="inline-flex items-center gap-3 rounded-[24px] bg-white/70 px-4 py-3 shadow-sm backdrop-blur">
                <div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-emerald-400 text-lg font-bold text-white shadow-sm">
                  ₫
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-emerald-600">
                    Expense Track
                  </p>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Finance Manager
                  </h2>
                </div>
              </div>

              <div className="mt-16 max-w-xl">
                <p className="inline-flex rounded-full bg-white/70 px-4 py-1.5 text-sm font-semibold text-emerald-700 shadow-sm">
                  Create your account
                </p>

                <h1 className="mt-6 text-5xl font-black leading-[1.08] text-slate-900 xl:text-6xl">
                  Bắt đầu hành trình
                  <span className="mt-2 block text-emerald-500">
                    quản lý tài chính dễ dàng
                  </span>
                </h1>

                <p className="mt-6 max-w-lg text-base leading-8 text-slate-600">
                  Tạo tài khoản để theo dõi thu chi, xây dựng kế hoạch tiết kiệm
                  và kiểm soát tài chính cá nhân trong một giao diện tinh gọn,
                  mềm mại và hiện đại.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-[30px] bg-white/70 p-5 shadow-sm backdrop-blur">
                <p className="text-sm text-slate-500">Quản lý thu chi</p>
                <h3 className="mt-2 text-xl font-black text-emerald-500">
                  Dễ dàng
                </h3>
              </div>
              <div className="rounded-[30px] bg-white/70 p-5 shadow-sm backdrop-blur">
                <p className="text-sm text-slate-500">Ngân sách</p>
                <h3 className="mt-2 text-xl font-black text-slate-900">
                  Trực quan
                </h3>
              </div>
              <div className="rounded-[30px] bg-white/70 p-5 shadow-sm backdrop-blur">
                <p className="text-sm text-slate-500">Tiết kiệm</p>
                <h3 className="mt-2 text-xl font-black text-lime-500">
                  Hiệu quả
                </h3>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT */}
        <section className="relative flex items-center justify-center px-6 py-10 sm:px-10 lg:px-16">
          <div className="absolute inset-0 lg:hidden bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.08),transparent_36%)]" />
          <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-emerald-100/40 blur-3xl lg:hidden" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-lime-100/40 blur-3xl lg:hidden" />

          <div className="w-full max-w-lg">
            <div className="mb-8 lg:hidden">
              <div className="inline-flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-emerald-400 text-lg font-bold text-white shadow-sm">
                  ₫
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-emerald-600">
                    Expense Track
                  </p>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Finance Manager
                  </h2>
                </div>
              </div>
            </div>

            <div className="rounded-[40px] border border-emerald-50 bg-white/82 p-10 shadow-[0_30px_80px_rgba(16,185,129,0.06)] backdrop-blur-xl sm:p-12">
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">
                  Get started
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-[34px]">
                  Tạo tài khoản mới
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Điền thông tin của bạn để bắt đầu sử dụng hệ thống quản lý tài
                  chính.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    {...register("fullname")}
                    placeholder="Nhập họ và tên"
                    className="w-full rounded-3xl border border-transparent bg-emerald-50/60 px-5 py-[18px] text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 hover:bg-white focus:border-emerald-200 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  />
                  {errors.fullname && (
                    <p className="mt-2 text-sm font-medium text-red-500">
                      {errors.fullname.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="you@example.com"
                    className="w-full rounded-3xl border border-transparent bg-emerald-50/60 px-5 py-[18px] text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 hover:bg-white focus:border-emerald-200 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm font-medium text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    {...register("password")}
                    placeholder="••••••••"
                    className="w-full rounded-3xl border border-transparent bg-emerald-50/60 px-5 py-[18px] text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 hover:bg-white focus:border-emerald-200 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  />
                  {errors.password && (
                    <p className="mt-2 text-sm font-medium text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-3xl bg-gradient-to-r from-emerald-300 to-green-400 py-[18px] text-sm font-semibold text-white shadow-md transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Đang tạo tài khoản..." : "Đăng ký"}
                </button>

                <button
                  type="button"
                  className="w-full rounded-3xl border border-emerald-100 bg-emerald-50/50 py-[18px] text-sm font-semibold text-slate-700 transition hover:bg-white"
                >
                  Đăng ký với Google
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-600">
                Đã có tài khoản?{" "}
                <Link
                  to="/login"
                  className="font-bold text-emerald-600 hover:text-emerald-700"
                >
                  Đăng nhập
                </Link>
              </p>

              <div className="mt-5 text-center">
                <Link
                  to="/"
                  className="text-sm font-medium text-slate-500 transition hover:text-emerald-600"
                >
                  ← Quay về trang chủ
                </Link>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-slate-400">
              © 2026 Expense Track. All rights reserved.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
