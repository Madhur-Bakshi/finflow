import { useState } from "react";
import { createTransaction } from "../services/api";

export default function TransactionForm({ onTransactionAdded }) {
  const [formData, setFormData] = useState({
    userId: "",
    merchant: "",
    amount: "",
    category: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createTransaction({
        ...formData,
        amount: Number(formData.amount),
      });

      setFormData({
        userId: "",
        merchant: "",
        amount: "",
        category: "",
      });

      onTransactionAdded();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-slate-900 rounded-xl p-4 mb-4">
      <h2 className="text-2xl font-semibold mb-3">Add Transaction</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-3">
        <input
          type="text"
          placeholder="User ID"
          value={formData.userId}
          onChange={(e) =>
            setFormData({
              ...formData,
              userId: e.target.value,
            })
          }
          className="bg-slate-800 px-3 py-2 rounded-lg text-sm"
          required
        />

        <input
          type="text"
          placeholder="Merchant"
          value={formData.merchant}
          onChange={(e) =>
            setFormData({
              ...formData,
              merchant: e.target.value,
            })
          }
          className="bg-slate-800 px-3 py-2 rounded-lg text-sm"
          required
        />

        <input
          type="number"
          placeholder="Amount"
          value={formData.amount}
          onChange={(e) =>
            setFormData({
              ...formData,
              amount: e.target.value,
            })
          }
          className="bg-slate-800 px-3 py-2 rounded-lg text-sm"
          required
        />

        <input
          type="text"
          placeholder="Category"
          value={formData.category}
          onChange={(e) =>
            setFormData({
              ...formData,
              category: e.target.value,
            })
          }
          className="bg-slate-800 px-3 py-2 rounded-lg text-sm"
          required
        />

        <button
          type="submit"
          className="col-span-4 bg-blue-600 hover:bg-blue-700 transition rounded-lg py-2 font-semibold text-sm"
        >
          Submit Transaction
        </button>
      </form>
    </div>
  );
}
