import { useForm } from "react-hook-form";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import api from "../api";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullname: z.string().min(3),
});
export const Register = () => {
  const nav = useNavigate();
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({
    resolver: zodResolver(registerSchema),
  });
  const onSubmit = async (data) => {
    try {
      const res = await api.post("/auth/register", data);
      nav("/login");
    } catch (error) {
      toast.error(error.response.data || "Error!");
    }
  };
  return (
    <div className="bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-fixed min-h-screen flex flex-col">
      <main className=" flex flex-col md:flex-row min-h-screen">
        <section className="hidden md:flex md:w-1/2 lg:w-3/5 bg-primary relative overflow-hidden flex-col justify-between p-12 lg:p-20">
          <div className="relative z-10 flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-fixed-dim rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-2xl">
                account_balance_wallet
              </span>
            </div>
            <span className="text-2xl font-black text-white">
              Expense <span className="text-primary-fixed-dim">Tracker</span>
            </span>
          </div>

          <div className="relative z-10 max-w-xl">
            <h1 className="text-5xl font-extrabold text-white mb-8 leading-tight">
              Làm chủ{" "}
              <span className="text-primary-fixed-dim">tài chính cá nhân</span>{" "}
              của bạn
            </h1>

            <p className="text-xl text-primary-fixed-dim/80 mb-12">
              Theo dõi thu chi, kiểm soát tài chính và tiết kiệm hiệu quả 💸
            </p>
          </div>

          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary via-primary to-primary-container opacity-90"></div>
            <img
              alt="Office"
              className="w-full h-full object-cover mix-blend-overlay"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdyXB9hja5etNz6geKVVFpCx1ZrFr4IbgcGIXQWqwnuLHhx9EdJv91FqraO9uR9hjztL4da67GOXslrXfM7eiGsJgzfrJRVlH1-mExO18IsJzFqxs9qF4rbD95fm2yW3fRE2SKnq8rMs6fc07bUdNSnbh5CFYmb-APR6qOsCyYm1YdGDpUFrKJupg1QsHwJkzgLSoP9_9jHjTon8-AaCfAKLpfQ0vtEst_uJKFFl6RRzkGjUqml45msoC6Cn3e-EW_kwPLLxTwKsA6"
            />
          </div>
        </section>

        <section className="flex-1 flex items-center justify-center p-8 bg-surface-bright">
          <div className="w-full max-w-md">
            <div className="mb-10">
              <h2 className="text-3xl font-extrabold mb-2">Create Account</h2>
              <p className="text-on-surface-variant">Begin your journey.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <h1>Register</h1>
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
                  Fullname
                </label>
                <input
                  className="form-control"
                  type="text"
                  {...register("fullname")}
                />

                {errors.fullname && (
                  <p className="text-danger">{errors.fullname.message}</p>
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
              <Link to="/login" className="text-primary font-bold">
                Login
              </Link>
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t p-4 text-center text-sm">
        © 2024 SpendLogic
      </footer>
    </div>
  );
};
