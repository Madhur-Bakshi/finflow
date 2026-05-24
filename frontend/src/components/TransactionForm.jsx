import { useState } from "react";
import { createTransaction } from "../services/api";

export default function TransactionForm({ onTransactionAdded }) {
  const [formData, setFormData] = useState({
    userId: "",
    merchant: "",
    amount: "",
    category: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 const handleSubmit = async (e) => {
   e.preventDefault();

   try {
     setLoading(true);

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

     alert("Transaction submitted successfully!");
   } catch (error) {
     console.error(error);

     alert("Failed to submit transaction");
   } finally {
     setLoading(false);
   }
 };
  return (
    <div className="bg-slate-900 rounded-2xl p-6 mb-10">
      <h2 className="text-2xl font-bold mb-6">Add Transaction</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <input
          type="text"
          name="userId"
          placeholder="User ID"
          value={formData.userId}
          onChange={handleChange}
          className="bg-slate-800 p-3 rounded-lg"
          required
        />

        <input
          type="text"
          name="merchant"
          placeholder="Merchant"
          value={formData.merchant}
          onChange={handleChange}
          className="bg-slate-800 p-3 rounded-lg"
          required
        />

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          className="bg-slate-800 p-3 rounded-lg"
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="bg-slate-800 p-3 rounded-lg"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-bold md:col-span-4 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Transaction"}
        </button>
      </form>
    </div>
  );
}
