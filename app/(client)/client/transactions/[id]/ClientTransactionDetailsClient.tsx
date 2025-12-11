"use client";

import { useState } from "react";
import { useClientAuth } from "@/hooks/use-client-auth";
import { useTransaction } from "@/hooks/use-transactions";
import { useToast } from "@/hooks/use-toast";
import { useTransactionWorkflow } from "@/hooks/use-transaction-workflow";
import { useTransactionDetailsHandlers } from "@/hooks/use-transaction-details-handlers";
import {
  TransactionProgressCard,
  TransactionTabs,
  PropertyDetailsCard,
  TransactionInfoCard,
  TransactionNotesCard,
} from "@/components/molecules";
import TransactionPeopleTab from "@/components/organisms/TransactionPeopleTab";
import TransactionHeader from "@/components/organisms/TransactionHeader";
import TransactionTimelineTab from "@/components/organisms/TransactionTimelineTab";
import TransactionDocumentsTab from "@/components/organisms/TransactionDocumentsTab";
import LoadingState from "@/components/molecules/LoadingState";
import ErrorState from "@/components/molecules/ErrorState";

interface ClientTransactionDetailsClientProps {
  transactionId: string;
}

export default function ClientTransactionDetailsClient({
  transactionId,
}: ClientTransactionDetailsClientProps) {
  const { clientUser } = useClientAuth();
  const { toast } = useToast();
  const {
    transaction,
    loading: loadingTransaction,
    error: transactionError,
    updateTransaction,
  } = useTransaction(transactionId);

  // Custom hooks for specific functionality
  const {
    workflow,
    workflowLoading,
    workflowError,
    fetchWorkflow,
    handleAddItemUpdate,
  } = useTransactionWorkflow(transactionId);

  // UI State and Handlers
  const { activeTab, handleTabChange, handleSaveNotes } =
    useTransactionDetailsHandlers({
      transaction,
      updateTransaction,
      workflow,
      workflowLoading,
      fetchWorkflow,
    });

  // Loading and error states
  if (loadingTransaction) {
    return <LoadingState title="Loading transaction details..." />;
  }

  if (transactionError || !transaction) {
    return (
      <ErrorState
        title="Error loading transaction"
        error={transactionError || "Transaction not found"}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <TransactionHeader
        title="Transaction Details"
        subtitle={`ID: ${transaction.transactionId}`}
        backLink="/client/transactions"
        backText="Back to Transactions"
        currentStatus={transaction.status}
        readOnly={true}
        nextIncompleteItemDate={transaction.nextIncompleteItemDate}
      />

      {/* Progress Bar */}
      <TransactionProgressCard transaction={transaction} />

      {/* Tabs */}
      <div className="bg-card rounded-lg border border-border">
        <TransactionTabs activeTab={activeTab} onTabChange={handleTabChange} />

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Property Details */}
              <div className="space-y-6">
                <PropertyDetailsCard transaction={transaction} />
                <TransactionInfoCard transaction={transaction} />
              </div>

              {/* Notes */}
              <div className="space-y-6">
                <TransactionNotesCard
                  transaction={transaction}
                  onSaveNotes={handleSaveNotes}
                />
              </div>
            </div>
          )}

          {activeTab === "people" && (
            <TransactionPeopleTab
              transactionId={transactionId}
              readOnly={true}
            />
          )}

          {activeTab === "timeline" && (
            <div className="space-y-6">
              <TransactionTimelineTab
                workflow={workflow}
                loading={workflowLoading}
                error={workflowError}
                fetchWorkflow={fetchWorkflow}
                readOnly={true}
                completedItems={transaction.completedWorkflowItems}
                totalItems={transaction.totalWorkflowItems}
                nextDue={transaction.nextIncompleteItemDate}
              />
            </div>
          )}

          {activeTab === "documents" && (
            <TransactionDocumentsTab
              transactionId={transactionId}
              readOnly={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}
