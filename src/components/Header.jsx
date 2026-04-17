import React from "react";

export const Header = () => {
  return (
    <div>
      <header className=" w-full sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm dark:shadow-none flex justify-between items-center px-6 py-3">
        <div className="flex items-center gap-6 flex-1">
          <h2 className="text-xl font-bold tracking-tight text-blue-700 dark:text-blue-400 headline-font md:hidden">
            SpendLogic
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-tertiary rounded-full border-2 border-white"></span>
          </button>

          <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <span className="material-symbols-outlined">help_outline</span>
          </button>

          <div className="h-8 w-[1px] bg-outline-variant/30 mx-1"></div>

          <div className="flex items-center gap-3 pl-2 cursor-pointer group">
            <img
              alt="User profile photo"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent group-hover:ring-primary/20 transition-all"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAr_d5IX2FlgFFhg9dn5TIoUajRGTvNskgAn9ePrDkKrrA8grQ5lMc8J_VzsyZ5C78iwMV8s5qy4mPMj2akjQDAWpY7o177wIMze6kRfkD_rY8FaDq--1u5DoN-lJjt7Pe74t2UmC6qNJA3jjeuAXaaE18ZUjJ4mxQAylfYB166mID1NcebpPxGnefBhie6FlHqgGFfNZGfMrimZiDakQjVt5XFXPNQ4uq341FRkXnWrj8qxICAc24pofp32J2TAflcSQp0mzLYbm1U"
            />
            <span className="hidden lg:block font-manrope text-sm font-medium text-slate-700">
              Alex Rivera
            </span>
          </div>
        </div>
      </header>
    </div>
  );
};
