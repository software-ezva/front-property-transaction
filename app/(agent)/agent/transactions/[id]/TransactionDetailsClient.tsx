"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Building2,
  User,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle,
  Edit,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  ChevronUp,
  BarChart3,
} from "lucide-react";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import ProgressBar from "@/components/atoms/ProgressBar";
import Link from "next/link";
import { useAgentAuth } from "@/hooks/use-agent-auth";
import { useToast } from "@/hooks/use-toast";
import PageTitle from "@/components/molecules/PageTitle";
import WorkflowTimeline from "@/components/organisms/WorkflowTimeline";
import { Transaction, TransactionStatus } from "@/types/transactions";
import type {
  TransactionUpdatePayload,
  ItemUpdatePayload,
} from "@/types/transactions/transactions";
import { ItemStatus, Item, Checklist, Workflow } from "@/types/workflow";
import { ENDPOINTS } from "@/lib/constants";
import { apiClient } from "@/lib/api-internal";

interface TransactionDetailsClientProps {
  transactionId: string;
}

export default function TransactionDetailsClient({
  transactionId,
}: TransactionDetailsClientProps) {
  const { agentUser, agentProfile } = useAgentAuth();
  const { toast } = useToast();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [loading, setLoading] = useState(true);
  const [workflowLoading, setWorkflowLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workflowError, setWorkflowError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<
    "overview" | "timeline" | "documents"
  >("overview");
  const [showStats, setShowStats] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Fetch transaction data from API
  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<Transaction>(
          `${ENDPOINTS.internal.TRANSACTIONS}/${transactionId}`
        );
        setTransaction(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    if (transactionId) {
      fetchTransaction();
    }
  }, [transactionId]);

  // Fetch workflow data from API
  const fetchWorkflow = async () => {
    try {
      setWorkflowLoading(true);
      setWorkflowError(null);
      const response = await apiClient.get<Workflow>(
        `${ENDPOINTS.internal.TRANSACTIONS}/${transactionId}/workflow`
      );
      setWorkflow(response);
    } catch (err) {
      setWorkflowError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setWorkflowLoading(false);
    }
  };

  // Handle tab change and fetch workflow if needed
  const handleTabChange = (tabId: "overview" | "timeline" | "documents") => {
    setActiveTab(tabId);
    if (tabId === "timeline" && !workflow && !workflowLoading) {
      fetchWorkflow();
    }
  };

  // Handler for updating workflow items
  const handleUpdateItem = async (
    itemId: string,
    itemUpdates: ItemUpdatePayload
  ) => {
    if (!transaction) {
      toast({
        title: "Error",
        description: "Transaction not loaded. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await apiClient.patch<Item>(
        `${ENDPOINTS.internal.TRANSACTIONS}/${transaction.transactionId}/workflow/items/${itemId}`,
        itemUpdates
      );
      // Update the local state with the new data
      if (workflow) {
        const updatedWorkflow: Workflow = {
          ...workflow,
          checklists: workflow.checklists.map((checklist) => ({
            ...checklist,
            items: checklist.items.map((item) =>
              item.id === itemId
                ? {
                    ...item,
                    ...itemUpdates,
                    status:
                      typeof itemUpdates.status !== "undefined"
                        ? (itemUpdates.status as ItemStatus)
                        : item.status,
                  }
                : item
            ),
          })),
        };
        setWorkflow(updatedWorkflow);
      }
      toast({
        title: "Task updated",
        variant: "default",
      });
    } catch (error) {
      console.error("Error updating item:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update task. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 p-6">
        <div className="text-center">Loading transaction details...</div>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 p-6">
        <div className="text-center text-red-600">
          Error: {error || "Transaction not found"}
        </div>
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

  const statusOptions = [
    { value: TransactionStatus.IN_PREPARATION, label: "In Preparation" },
    { value: TransactionStatus.ACTIVE, label: "Active" },
    { value: TransactionStatus.UNDER_CONTRACT, label: "Under Contract" },
    { value: TransactionStatus.SOLD_LEASED, label: "Sold/Leased" },
    { value: TransactionStatus.TERMINATED, label: "Terminated" },
    { value: TransactionStatus.WITHDRAWN, label: "Withdrawn" },
  ];

  // General transaction update handler
  const handleTransactionUpdate = async (
    txUpdates: TransactionUpdatePayload
  ) => {
    if (!transaction) return;
    setStatusUpdating(true);
    try {
      await apiClient.patch(
        `${ENDPOINTS.internal.TRANSACTIONS}/${transactionId}`,
        { transactionId: transaction.transactionId, ...txUpdates }
      );
      setTransaction({ ...transaction, ...txUpdates });
      toast({
        title: "Transaction updated",
        description:
          Object.keys(txUpdates).length === 1
            ? `Field '${Object.keys(txUpdates)[0]}' updated successfully.`
            : `Transaction updated successfully.`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update transaction.",
        variant: "destructive",
      });
    } finally {
      setStatusUpdating(false);
    }
  };

  // Mantener compatibilidad con el dropdown de status
  const handleStatusChange = (newStatus: string) => {
    if (!transaction || transaction.status === newStatus) return;
    handleTransactionUpdate({ status: newStatus });
  };

  const progress =
    (transaction.completedWorkflowItems / transaction.totalWorkflowItems) * 100;

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
          <Select
            value={transaction.status}
            onValueChange={handleStatusChange}
            disabled={statusUpdating}
          >
            <SelectTrigger className="w-[170px] h-8 px-2 py-0 border-none bg-transparent shadow-none">
              <Badge
                variant={
                  statusVariant[
                    transaction.status as keyof typeof statusVariant
                  ] || "default"
                }
                className="w-full justify-between cursor-pointer px-3 py-1 text-xs font-semibold"
              >
                <SelectValue>
                  {statusOptions
                    .find((opt) => opt.value === transaction.status)
                    ?.label.toUpperCase()}
                </SelectValue>
                {statusUpdating && (
                  <span className="ml-2 animate-pulse text-xs text-muted-foreground">
                    ...
                  </span>
                )}
              </Badge>
            </SelectTrigger>
            <SelectContent className="min-w-[170px]">
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quick Stats Dropdown */}
      <div className="bg-card rounded-lg border border-border">
        <button
          onClick={() => setShowStats(!showStats)}
          className="w-full flex items-center justify-between py-2 px-4 hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="text-base font-semibold text-foreground">
              Transaction Stats
            </h3>
          </div>
          {showStats ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        {showStats && (
          <div className="px-4 pb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
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
                    (transaction.propertyPrice ||
                      transaction.propertyValue ||
                      0) * 0.03
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
                    ? new Date(
                        transaction.nextIncompleteItemDate
                      ).toLocaleDateString()
                    : "TBD",
                  label: "Next Task Date",
                  iconColor: "text-tertiary",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-muted/30 rounded-lg p-3 text-center"
                >
                  <stat.icon
                    className={`w-5 h-5 mx-auto mb-1 ${stat.iconColor}`}
                  />
                  <div className="text-lg font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="bg-card rounded-lg p-4 border border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-semibold text-foreground">
            Overall Progress
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
              <div className="space-y-6">
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Building2 className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">
                      Property Details
                    </h3>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                    <div>
                      <h4 className="font-medium text-foreground">Property</h4>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {transaction.propertyAddress}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <span className="ml-1 font-medium">
                          {transaction.transactionType}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Size:</span>
                        <span className="ml-1 font-medium">
                          {transaction.propertySize
                            ? `${transaction.propertySize.toLocaleString()} sqft`
                            : "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Bedrooms:</span>
                        <span className="ml-1 font-medium">
                          {transaction.propertyBedrooms || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Bathrooms:
                        </span>
                        <span className="ml-1 font-medium">
                          {transaction.propertyBathrooms || "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-border">
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
                      <span className="text-muted-foreground">Created:</span>
                      <span className="font-medium">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Last Updated:
                      </span>
                      <span className="font-medium">
                        {new Date(transaction.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-medium capitalize">
                        {transaction.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                  {transaction.additionalNotes && (
                    <div className="mt-4">
                      <h4 className="font-medium text-foreground mb-2">
                        Notes
                      </h4>
                      <p className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">
                        {transaction.additionalNotes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Client Details */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <User className="w-5 h-5 text-secondary" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Client Information
                  </h3>
                </div>
                {transaction.clientName ? (
                  <div className="bg-muted/30 rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-foreground">
                          {transaction.clientName}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {transaction.clientEmail || "Email not provided"}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phone:</span>
                        <span className="font-medium">
                          {transaction.clientPhoneNumber || "Not provided"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Property Value:
                        </span>
                        <span className="font-medium">
                          $
                          {(
                            transaction.propertyPrice ||
                            transaction.propertyValue ||
                            0
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-muted/30 rounded-lg p-4 text-center">
                    <User className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground mb-3">
                      No client assigned to this transaction
                    </p>
                    <Button variant="outline" size="sm">
                      Assign Client
                    </Button>
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
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Documents
              </h3>
              <p className="text-muted-foreground mb-4">
                Document management feature coming soon
              </p>
              <Button variant="outline">Upload Document</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
