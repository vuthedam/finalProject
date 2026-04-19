import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Layout } from "../Layout";
import HomeFinancePage from "../pages/HomeFinancePage";
import { Dashboard } from "../pages/Dashboard";
import { Reports } from "../pages/Reports";

import { Login } from "../auth/Login";
import { Register } from "../auth/Register";
import PrivateRoute from "./PrivateRoute";

import { IncomeCategories } from "../pages/income/IncomeCategories";
import { IncomeCategoryForm } from "../pages/income/IncomeCategoryForm";
import { IncomeTransactions } from "../pages/income/IncomeTransactions";
import { IncomeTransactionForm } from "../pages/income/IncomeTransactionForm";

import { ExpenseCategories } from "../pages/expense/ExpenseCategories";
import { ExpenseCategoryForm } from "../pages/expense/ExpenseCategoryForm";
import { ExpenseTransactions } from "../pages/expense/ExpenseTransactions";
import { ExpenseTransactionForm } from "../pages/expense/ExpenseTransactionForm";

const router = createBrowserRouter([
  // Public routes
  {
    path: "/",
    element: <HomeFinancePage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },

  // Private routes
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Layout />
      </PrivateRoute>
    ),
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "reports", element: <Reports /> },

      // Income
      { path: "income/categories", element: <IncomeCategories /> },
      { path: "income/categories/create", element: <IncomeCategoryForm /> },
      { path: "income/categories/:id/edit", element: <IncomeCategoryForm /> },
      { path: "income/transactions", element: <IncomeTransactions /> },
      {
        path: "income/transactions/create",
        element: <IncomeTransactionForm />,
      },
      {
        path: "income/transactions/:id/edit",
        element: <IncomeTransactionForm />,
      },

      // Expense
      { path: "expense/categories", element: <ExpenseCategories /> },
      { path: "expense/categories/create", element: <ExpenseCategoryForm /> },
      {
        path: "expense/categories/:id/edit",
        element: <ExpenseCategoryForm />,
      },
      { path: "expense/transactions", element: <ExpenseTransactions /> },
      {
        path: "expense/transactions/create",
        element: <ExpenseTransactionForm />,
      },
      {
        path: "expense/transactions/:id/edit",
        element: <ExpenseTransactionForm />,
      },
    ],
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
