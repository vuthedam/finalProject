import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "../Layout";
import { Dashboard } from "../pages/Dashboard";
import { Transactions } from "../pages/Transactions";
import { Login } from "../auth/Login";
import { Register } from "../auth/Register";
import { Categories } from "../pages/Categories";
import { Add_EditTransactions } from "../pages/Add_EditTransactions";
import { Reports } from "../pages/Reports";
const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/categories",
        element: <Categories />,
      },
      {
        path: "/reports",
        element: <Reports />,
      },
      {
        path: "/transactions",
        element: <Transactions />,
      },
      {
        path: "/add",
        element: <Add_EditTransactions />,
      },
      {
        path: "/edit/:id",
        element: <Add_EditTransactions />,
      },
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },
]);
const AppRoutes = ({ children }) => {
  return <RouterProvider router={routes}>{children}</RouterProvider>;
};
export default AppRoutes;
