"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  CheckCircle,
  FileText,
  Building2,
  MapPin,
} from "lucide-react";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ProgressBar from "@/components/atoms/ProgressBar";
import Link from "next/link";
import { useClientAuth } from "@/hooks/use-client-auth";
import { useTransaction } from "@/hooks/use-transactions";
import { useTransactionDocuments } from "@/hooks/use-transaction-documents";
import { useTransactionWorkflow } from "@/hooks/use-transaction-workflow";
import { useToast } from "@/hooks/use-toast";
import PageTitle from "@/components/molecules/PageTitle";
import DocumentsList from "@/components/organisms/DocumentsList";
import WorkflowTimeline from "@/components/organisms/WorkflowTimeline";
import { Transaction, TransactionStatus } from "@/types/transactions";
import { Document } from "@/types/documents";
import { useRouter } from "next/navigation";

interface ClientTransactionDetailsClientProps {
  transactionId: string;
}

export default function ClientTransactionDetailsClient({
  transactionId,
}: ClientTransactionDetailsClientProps) {
  const { clientUser, clientProfile } = useClientAuth();
  const { toast } = useToast();
  const router = useRouter();
  const {
    transaction,
    loading: loadingTransaction,
    error: transactionError,
  } = useTransaction(transactionId);

  // Use custom hooks for documents and workflow
  const {
    documents,
    documentsLoading,
    documentsError,
    handleViewDocument: handleViewDocumentFromHook,
    fetchDocuments,
  } = useTransactionDocuments(transactionId);

  const { workflow, workflowLoading, workflowError, fetchWorkflow } =
    useTransactionWorkflow(transactionId);

  const [activeTab, setActiveTab] = useState<
    "overview" | "timeline" | "documents"
  >("overview");

  // Handle tab change and fetch workflow if needed
  const handleTabChange = (tabId: "overview" | "timeline" | "documents") => {
    setActiveTab(tabId);
    if (tabId === "timeline" && !workflow && !workflowLoading) {
      fetchWorkflow();
    }
  };

  // Custom handler for viewing documents (client-specific routing)
  const handleViewDocument = (document: Document) => {
    // Use the hook's handler which has proper error handling and API calls
    handleViewDocumentFromHook(document);
  };

  // If we reach here, authentication was successful thanks to the layout
  if (!clientUser || !clientProfile) {
    return <div>Loading user data...</div>;
  }

  if (loadingTransaction) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Loading transaction details...
          </p>
        </div>
      </div>
    );
  }

  if (transactionError || !transaction) {
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-destructive mb-4">
          Error Loading Transaction
        </h2>
        <p className="text-muted-foreground mb-6">
          {transactionError || "Transaction not found"}
        </p>
        <Link href="/client/transactions">
          <Button variant="outline">Back to Transactions</Button>
        </Link>
      </div>
    );
  }

  const statusVariant = {
    [TransactionStatus.IN_PREPARATION]: "warning" as const,
    [TransactionStatus.ACTIVE]: "default" as const,
    [TransactionStatus.UNDER_CONTRACT]: "default" as const,
    [TransactionStatus.SOLD_LEASED]: "success" as const,
    [TransactionStatus.TERMINATED]: "error" as const,
    [TransactionStatus.WITHDRAWN]: "error" as const,
  };

  const progress =
    (transaction.completedWorkflowItems / transaction.totalWorkflowItems) * 100;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link href="/client/transactions">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to My Transactions
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
          <Badge
            variant={
              statusVariant[transaction.status as keyof typeof statusVariant] ||
              "default"
            }
            className="px-3 py-1 text-xs font-semibold"
          >
            {transaction.status.replace("_", " ").toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-card rounded-lg p-4 border border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-semibold text-foreground">
            Transaction Progress
          </h3>
          <span className="text-xs font-medium">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <ProgressBar value={progress} variant="primary" />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>
            {transaction.completedWorkflowItems} of{" "}
            {transaction.totalWorkflowItems} tasks
          </span>
          <span>
            Started {new Date(transaction.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card rounded-lg border border-border">
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "overview", label: "Overview" },
              { id: "timeline", label: "Timeline" },
              { id: "documents", label: "Documents" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Property Details */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Building2 className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Property Information
                  </h3>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-foreground text-base mb-1">
                        {transaction.propertyAddress}
                      </h4>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span>Property Address</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Size:</span>
                      <span className="ml-1 font-medium">
                        {transaction.propertySize || "N/A"} sq ft
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Bedrooms:</span>
                      <span className="ml-1 font-medium">
                        {transaction.propertyBedrooms || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Bathrooms:</span>
                      <span className="ml-1 font-medium">
                        {transaction.propertyBathrooms || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-border mt-4">
                    <div className="text-xl font-bold text-primary">
                      $
                      {(
                        transaction.propertyPrice ||
                        transaction.propertyValue ||
                        0
                      ).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction Info */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <FileText className="w-5 h-5 text-tertiary" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Transaction Information
                  </h3>
                </div>
                <div className="bg-muted/30 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium capitalize">
                      {transaction.transactionType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium capitalize">
                      {transaction.status.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span className="font-medium">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Updated:</span>
                    <span className="font-medium">
                      {new Date(transaction.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {transaction.additionalNotes && (
                  <div className="mt-4">
                    <h4 className="font-medium text-foreground mb-2">Notes</h4>
                    <p className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">
                      {transaction.additionalNotes}
                    </p>
                  </div>
                )}
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
                  // Note: Not passing onUpdateItem makes it read-only for client
                />
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Timeline Coming Soon
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Your workflow timeline will be available soon
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
            <DocumentsList
              documents={documents}
              loading={documentsLoading}
              error={documentsError}
              onViewDocument={handleViewDocument}
              onRetry={fetchDocuments}
              // Note: Not passing onAddDocuments or onArchiveDocument makes it read-only for client
            />
          )}
        </div>
      </div>
    </div>
  );
}
