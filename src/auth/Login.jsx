import { useForm } from "react-hook-form";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import api from "../api";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export const Login = () => {
  const nav = useNavigate();
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });
  const onSubmit = async (data) => {
    try {
      const res = await api.post("/login", data);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("accessToken", res.data.accessToken);
      nav("/");
    } catch (error) {
      toast.error(error.response.data || "Error!");
    }
  };
  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <main className="flex-grow flex flex-col md:flex-row min-h-screen">
        {/* LEFT - FORM */}
        <section className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 bg-surface-container-lowest">
          <div className="w-full max-w-md space-y-12">
            {/* Branding */}
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-8w ư h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-primary text-xl">
                    account_balance_wallet
                  </span>
                </div>
                <span className="text-2xl font-black text-primary uppercase">
                  Expense Track
                </span>
              </div>
              <h1 className="text-3xl font-extrabold">Welcome back</h1>
              <p className="text-on-surface-variant text-base">
                Đăng nhập để tiếp tục hành trình tài chính của bạn
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label className="form-label" htmlFor="">
                  Email
                </label>
                <input
                  className="form-control"
                  type="email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-danger">{errors.email.message}</p>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="">
                  Password
                </label>
                <input
                  className="form-control"
                  type="password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-danger">{errors.password.message}</p>
                )}
              </div>

              <div className="mb-3">
                <button className="btn btn-primary w-100">Send</button>
              </div>
            </form>

            <p className="mt-6 text-center text-sm">
              Already have an account?{" "}
              <Link to="/register" className="text-primary font-bold">
                register
              </Link>
            </p>
          </div>
        </section>

        {/* RIGHT - IMAGE */}
        <section className="hidden md:block md:w-1/2 relative bg-primary">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSYv3wvYOgFkEjM8sebpNEEgZf0KgZ1a715g98qhsDETuqPSPrCu9d_2mXc2wSxF6T9kTxIAPOqqCgpzNngQzTpQ3FpS-3E_DEcHagZEMh8JW_KPgD2WSRD6YnEZYMzXUme1tp7F3jcuOCUQLrm28aHEkVUJhW0YvnTXCNHyXS8oV-PleWwseKO_cLi28KoX_5C9TpQX6vMfTFHAugsdjUzEm3T7jlZqsgvmuehYXsGOrvRLWXBDboNvx_LwscrwyR9hA7MBPTe-pp"
            alt="background"
            className="w-full h-full object-cover"
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t p-6 text-center text-xs">
        © 2024 Ventura Ledger
      </footer>
    </div>
  );
};
