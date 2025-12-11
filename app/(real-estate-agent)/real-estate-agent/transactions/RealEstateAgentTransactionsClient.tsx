"use client";

import { useState } from "react";
import { AlertCircle, Plus } from "lucide-react";
import Button from "@/components/atoms/Button";
import PageTitle from "@/components/molecules/PageTitle";
import LoadingState from "@/components/molecules/LoadingState";
import JoinTransactionDialog from "@/components/molecules/JoinTransactionDialog";
import { useRealEstateAgentAuth } from "@/hooks/use-real-estate-agent-auth";
import { useTransactions } from "@/hooks/use-transactions";
import { useRouter } from "next/navigation";
import TransactionStats from "@/components/organisms/transactions/TransactionStats";
import TransactionFilters from "@/components/organisms/transactions/TransactionFilters";
import TransactionList from "@/components/organisms/transactions/TransactionList";
import { useTransactionFilters } from "@/hooks/use-transaction-filters";

export default function RealEstateAgentTransactionsClient() {
  const { agentUser, agentProfile } = useRealEstateAgentAuth();
  const router = useRouter();
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
  if (!agentUser || !agentProfile) {
    return <LoadingState title="Loading user data..." />;
  }

  // Check for urgent actions (Client-style informative logic)
  const hasUrgentActions = transactions.some((t) => {
    if (!t.nextIncompleteItemDate) return false;
    const deadline = new Date(t.nextIncompleteItemDate);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return deadline <= tomorrow;
  });

  const handleViewTransactionDetails = (transactionId: string) => {
    router.push(`/real-estate-agent/transactions/${transactionId}`);
  };

  if (loadingTransactions) {
    return <LoadingState title="Loading transactions..." />;
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-destructive mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-primary hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Informative Message (Client-style adaptation) */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <PageTitle
            title={`Welcome back, ${agentUser.name}!`}
            subtitle={
              hasUrgentActions
                ? "You have transactions with upcoming deadlines requiring attention."
                : transactions.length > 0
                ? "Your portfolio is looking healthy. Here is an overview of your transactions."
                : "No active transactions found."
            }
          />
          <Button onClick={() => setIsJoinDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Join with Code
          </Button>
        </div>

        {hasUrgentActions && (
          <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-orange-600 mr-2" />
              <span className="text-orange-800">
                Attention needed: Some transactions have deadlines approaching
                within 24 hours.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid (Coordinator-style) */}
      <TransactionStats transactions={transactions} />

      {/* Filters (Coordinator-style) */}
      <TransactionFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {/* Transactions List (Coordinator-style vertical stack) */}
      <TransactionList
        transactions={filteredTransactions}
        loading={loadingTransactions}
        error={error}
        onViewDetails={handleViewTransactionDetails}
        emptyStateMessage={
          searchTerm || statusFilter !== "all"
            ? "Try adjusting your filters"
            : "You don't have any assigned transactions yet."
        }
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
