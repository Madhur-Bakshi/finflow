import axios from "axios";

const TRANSACTION_API = "http://localhost:8081/api/transactions";

const FRAUD_API = "http://localhost:8082/api/fraud";

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