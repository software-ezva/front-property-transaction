import { useState, useMemo } from "react";
import { Transaction } from "@/types/transactions";

export function useTransactionFilters(transactions: Transaction[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesSearch =
        transaction.propertyAddress
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (transaction.transactionType || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      // Note: clientName is not in the Transaction interface in types/transactions.ts but used in some files.
      // We can add it if needed, or rely on propertyAddress which is standard.

      const matchesStatus =
        statusFilter === "all" || transaction.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [transactions, searchTerm, statusFilter]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredTransactions,
  };
}
