"use client";

import type React from "react";
import { Plus } from "lucide-react";
import Button from "@/components/atoms/Button";
import { useTransactionCoordinatorAgentAuth } from "@/hooks/use-transaction-coordinator-agent-auth";
import { useTransactions } from "@/hooks/use-transactions";
import PageTitle from "@/components/molecules/PageTitle";
import TransactionStats from "@/components/organisms/transactions/TransactionStats";
import TransactionFilters from "@/components/organisms/transactions/TransactionFilters";
import TransactionList from "@/components/organisms/transactions/TransactionList";
import { useTransactionFilters } from "@/hooks/use-transaction-filters";

export default function AgentTransactionsClient() {
  const {
    transactionCoordinatorAgentUser: agentUser,
    transactionCoordinatorAgentProfile: agentProfile,
  } = useTransactionCoordinatorAgentAuth();
  const {
    transactions,
    loading: loadingTransactions,
    error,
  } = useTransactions();

  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredTransactions,
  } = useTransactionFilters(transactions);

  // If we get here, we already know authentication was successful thanks to the layout
  if (!agentUser || !agentProfile) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <PageTitle
            title="Transactions"
            subtitle="Manage and monitor all your real estate transactions."
          />
        </div>
        <Button
          onClick={() => {
            window.location.href =
              "/transaction-coordinator/transactions/create";
          }}
          className="sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Transaction
        </Button>
      </div>

      {/* Stats */}
      <TransactionStats transactions={transactions} />

      {/* Filters */}
      <TransactionFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {/* Transactions List */}
      <TransactionList
        transactions={filteredTransactions}
        loading={loadingTransactions}
        error={error}
        onViewDetails={(id) => {
          window.location.href = `/transaction-coordinator/transactions/${id}`;
        }}
        emptyStateAction={{
          label: "Create First Transaction",
          onClick: () => {
            window.location.href =
              "/transaction-coordinator/transactions/create";
          },
        }}
      />
    </div>
  );
}
