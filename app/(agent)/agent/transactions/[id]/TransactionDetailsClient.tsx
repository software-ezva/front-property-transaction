"use client";

import { useState } from "react";
import { ArrowLeft, BarChart3, CheckCircle } from "lucide-react";
import Button from "@/components/atoms/Button";
import Link from "next/link";
import { useAgentAuth } from "@/hooks/use-agent-auth";
import { useTransaction } from "@/hooks/use-transactions";
import { useToast } from "@/hooks/use-toast";
import { useTransactionDocuments } from "@/hooks/use-transaction-documents";
import { useTransactionWorkflow } from "@/hooks/use-transaction-workflow";
import {
  PageTitle,
  CollapsibleStatsCard,
  TransactionStatusSelector,
  TransactionProgressCard,
  TransactionTabs,
  PropertyDetailsCard,
  TransactionInfoCard,
  ClientAssignmentCard,
  TransactionNotesCard,
} from "@/components/molecules";
import DocumentsList from "@/components/organisms/DocumentsList";
import DocumentTemplateSelector from "@/components/organisms/DocumentTemplateSelector";
import WorkflowTimeline from "@/components/organisms/WorkflowTimeline";
import { StatItemData } from "@/components/atoms/StatItem";
import { Transaction } from "@/types/transactions";
import type { TransactionUpdatePayload } from "@/types/transactions/transactions";
import { DollarSign, Calendar } from "lucide-react";

interface TransactionDetailsClientProps {
  transactionId: string;
}

export default function TransactionDetailsClient({
  transactionId,
}: TransactionDetailsClientProps) {
  const { agentUser, agentProfile } = useAgentAuth();
  const { toast } = useToast();
  const {
    transaction,
    loading: loadingTransaction,
    error: transactionError,
    updateTransaction,
  } = useTransaction(transactionId);

  // Custom hooks for specific functionality
  const {
    documents,
    documentsLoading,
    documentsError,
    isAddDocumentModalOpen,
    setIsAddDocumentModalOpen,
    selectedTemplates,
    addingDocuments,
    documentTemplates,
    templatesLoading,
    templatesError,
    fetchDocuments,
    fetchDocumentTemplates,
    handleTemplateToggle,
    handleAddSelectedDocuments,
    handleViewDocument,
    handleArchiveDocument,
  } = useTransactionDocuments(transactionId);

  const {
    workflow,
    workflowLoading,
    workflowError,
    fetchWorkflow,
    handleUpdateItem,
  } = useTransactionWorkflow(transactionId);

  // UI State
  const [activeTab, setActiveTab] = useState<
    "overview" | "timeline" | "documents"
  >("overview");
  const [showStats, setShowStats] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Handle tab change and fetch data if needed
  const handleTabChange = (tabId: "overview" | "timeline" | "documents") => {
    setActiveTab(tabId);
    if (tabId === "timeline" && !workflow && !workflowLoading) {
      fetchWorkflow();
    }
    // Los documentos se cargan automáticamente cuando se inicializa el hook
    // No necesitamos verificar documents.length porque la API real siempre debe consultarse
  };

  // General transaction update handler
  const handleTransactionUpdate = async (
    txUpdates: TransactionUpdatePayload
  ) => {
    if (!transaction) return;
    setStatusUpdating(true);
    try {
      await updateTransaction(txUpdates);
      // Solo mostrar toast de éxito si la función fue llamada directamente para cambio de status
      // Las funciones específicas (notas, cliente) manejan sus propios toasts de éxito
      if (txUpdates.status && Object.keys(txUpdates).length === 1) {
        toast({
          title: "Transaction updated",
          description: "Status updated successfully.",
          variant: "default",
        });
      }
    } catch (error) {
      // No mostrar toast aquí porque apiFetch ya maneja los errores automáticamente
      // Solo re-lanzar el error para que las funciones que llaman a esta sepan que falló
      throw error;
    } finally {
      setStatusUpdating(false);
    }
  };

  // Handle status change
  const handleStatusChange = (newStatus: string) => {
    if (!transaction || transaction.status === newStatus) return;
    handleTransactionUpdate({ status: newStatus });
  };

  // Handle client assignment
  const handleClientAssignment = async (clientId: string) => {
    if (!transaction) return;

    try {
      await handleTransactionUpdate({ clientId });
      toast({
        title: "Client assigned",
        description:
          "Client has been successfully assigned to this transaction",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error assigning client",
        description:
          error instanceof Error
            ? error.message
            : "Failed to assign client to transaction",
        variant: "destructive",
      });
    }
  };

  // Handle notes saving
  const handleSaveNotes = async (notes: string) => {
    if (!transaction) return;

    try {
      await handleTransactionUpdate({ additionalNotes: notes });
      toast({
        title: "Notes updated",
        description: "Transaction notes have been updated successfully",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error updating notes",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update transaction notes",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Loading and error states
  if (loadingTransaction) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 p-6">
        <div className="text-center">Loading transaction details...</div>
      </div>
    );
  }

  if (transactionError || !transaction) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 p-6">
        <div className="text-center text-red-600">
          Error: {transactionError || "Transaction not found"}
        </div>
      </div>
    );
  }

  // Stats data for the collapsible card
  const statsData: StatItemData[] = [
    {
      icon: DollarSign,
      value: `$${(
        transaction.propertyPrice ||
        transaction.propertyValue ||
        0
      ).toLocaleString()}`,
      label: "Property Value",
      iconColor: "text-primary",
    },
    {
      icon: DollarSign,
      value: `$${Math.round(
        (transaction.propertyPrice || transaction.propertyValue || 0) * 0.03
      ).toLocaleString()}`,
      label: "Est. Commission",
      iconColor: "text-accent",
    },
    {
      icon: CheckCircle,
      value: transaction.completedWorkflowItems,
      label: "Tasks Completed",
      iconColor: "text-secondary",
    },
    {
      icon: Calendar,
      value: transaction.nextIncompleteItemDate
        ? new Date(transaction.nextIncompleteItemDate).toLocaleDateString()
        : "TBD",
      label: "Next Task Date",
      iconColor: "text-tertiary",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link href="/agent/transactions">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Transactions
            </Button>
          </Link>
          <div>
            <PageTitle
              title="Transaction Details"
              subtitle={`ID: ${transaction.transactionId}`}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <TransactionStatusSelector
            currentStatus={transaction.status}
            onStatusChange={handleStatusChange}
            disabled={statusUpdating}
          />
        </div>
      </div>

      {/* Quick Stats Dropdown */}
      <CollapsibleStatsCard
        title="Transaction Stats"
        icon={BarChart3}
        defaultOpen={showStats}
        statsSize="md"
        stats={statsData}
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

              {/* Client Details */}
              <div className="space-y-6">
                <ClientAssignmentCard
                  transaction={transaction}
                  onClientAssignment={handleClientAssignment}
                />
                <TransactionNotesCard
                  transaction={transaction}
                  onSaveNotes={handleSaveNotes}
                />
              </div>
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground">
                Workflow Timeline
              </h3>
              {workflowLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading workflow...</p>
                </div>
              ) : workflowError ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Error Loading Timeline
                  </h3>
                  <p className="text-muted-foreground mb-4">{workflowError}</p>
                  <Button variant="outline" onClick={fetchWorkflow}>
                    Retry
                  </Button>
                </div>
              ) : workflow && workflow.checklists ? (
                <WorkflowTimeline
                  workflow={workflow}
                  onUpdateItem={handleUpdateItem}
                />
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Timeline Coming Soon
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Workflow timeline will be loaded from a separate endpoint
                    for better performance
                  </p>
                  <div className="text-sm text-muted-foreground">
                    <p>
                      Progress: {transaction.completedWorkflowItems} of{" "}
                      {transaction.totalWorkflowItems} items completed
                    </p>
                    {transaction.nextIncompleteItemDate && (
                      <p>
                        Next task due:{" "}
                        {new Date(
                          transaction.nextIncompleteItemDate
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "documents" && (
            <>
              <DocumentsList
                documents={documents}
                loading={documentsLoading}
                error={documentsError}
                onAddDocuments={() => setIsAddDocumentModalOpen(true)}
                onViewDocument={handleViewDocument}
                onArchiveDocument={handleArchiveDocument}
                onRetry={fetchDocuments}
              />

              <DocumentTemplateSelector
                open={isAddDocumentModalOpen}
                onOpenChange={setIsAddDocumentModalOpen}
                templates={documentTemplates}
                selectedTemplates={selectedTemplates}
                onTemplateToggle={handleTemplateToggle}
                onAddSelected={handleAddSelectedDocuments}
                loading={addingDocuments}
                templatesLoading={templatesLoading}
                templatesError={templatesError}
                onRetryTemplates={fetchDocumentTemplates}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
