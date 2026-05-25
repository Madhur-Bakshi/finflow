import axios from "axios";

const TRANSACTION_API = "https://finflow-1-rkkg.onrender.com/api/transactions";

const FRAUD_API = "https://finflow-demo.onrender.com/api/fraud";

export const fetchTransactions = async () => {
  const response = await axios.get(TRANSACTION_API);
  return response.data;
};

export const fetchFrauds = async () => {
  const response = await axios.get(FRAUD_API);
  return response.data;
};

export const createTransaction = async (transaction) => {
  const response = await axios.post(TRANSACTION_API, transaction);

  return response.data;
};