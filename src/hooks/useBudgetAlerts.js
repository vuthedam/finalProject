import { useEffect, useState } from "react";

export const useBudgetAlerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("user"))?.id;
    if (!userId) return;

    const fetchAlerts = async () => {
      try {
        const [cateRes, expRes] = await Promise.all([
          fetch(`http://localhost:3000/expenseCategories?userId=${userId}`),
          fetch(`http://localhost:3000/expenses?userId=${userId}`),
        ]);
        const categories = await cateRes.json();
        const expenses = await expRes.json();

        const result = categories
          .filter((c) => Number(c.budget) > 0)
          .map((c) => {
            const spent = expenses
              .filter((t) => t.categoryId == c.id)
              .reduce((sum, t) => sum + Number(t.amount || 0), 0);
            const percent = Math.round((spent / c.budget) * 100);
            return { id: c.id, name: c.name, budget: c.budget, spent, percent };
          })
          .filter((c) => c.percent >= 80)
          .sort((a, b) => b.percent - a.percent);

        setAlerts(result);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAlerts();
  }, []);

  return alerts;
};
