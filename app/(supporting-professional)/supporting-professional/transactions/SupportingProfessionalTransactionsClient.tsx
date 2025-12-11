"use client";

import type React from "react";
import { useState } from "react";
import { Plus } from "lucide-react";
import Button from "@/components/atoms/Button";
import JoinTransactionDialog from "@/components/molecules/JoinTransactionDialog";
import { useSupportingProfessionalAuth } from "@/hooks/use-supporting-professional-auth";
import { useTransactions } from "@/hooks/use-transactions";
import PageTitle from "@/components/molecules/PageTitle";
import TransactionStats from "@/components/organisms/transactions/TransactionStats";
import TransactionFilters from "@/components/organisms/transactions/TransactionFilters";
import TransactionList from "@/components/organisms/transactions/TransactionList";
import { useTransactionFilters } from "@/hooks/use-transaction-filters";

export default function SupportingProfessionalTransactionsClient() {
  const { supportingProfessionalUser, supportingProfessionalProfile } =
    useSupportingProfessionalAuth();
  const {
    transactions,
    loading: loadingTransactions,
    error,
    refetch,
  } = useTransactions();

  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredTransactions,
  } = useTransactionFilters(transactions);

  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);

  // If we get here, we already know authentication was successful thanks to the layout
  if (!supportingProfessionalUser || !supportingProfessionalProfile) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageTitle
          title="Transactions"
          subtitle="View and monitor real estate transactions you're involved in."
        />
        <Button onClick={() => setIsJoinDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Join with Code
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
          window.location.href = `/supporting-professional/transactions/${id}`;
        }}
        emptyStateMessage="No transactions match the applied filters."
      />

      <JoinTransactionDialog
        isOpen={isJoinDialogOpen}
        onClose={() => setIsJoinDialogOpen(false)}
        onSuccess={() => {
          refetch();
        }}
      />
    </div>
  );
}
