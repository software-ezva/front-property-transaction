import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Transaction } from "@/types/transactions";
import { TransactionUpdatePayload } from "@/types/transactions/transactions";

interface UseTransactionDetailsHandlersProps {
  transaction: Transaction | null;
  updateTransaction?: (updates: TransactionUpdatePayload) => Promise<void>;
  workflow: any;
  workflowLoading: boolean;
  fetchWorkflow: () => Promise<void>;
}

export function useTransactionDetailsHandlers({
  transaction,
  updateTransaction,
  workflow,
  workflowLoading,
  fetchWorkflow,
}: UseTransactionDetailsHandlersProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<
    "overview" | "timeline" | "documents" | "people"
  >("overview");
  const [statusUpdating, setStatusUpdating] = useState(false);

  const handleTabChange = (
    tabId: "overview" | "timeline" | "documents" | "people"
  ) => {
    if (tabId === "documents") {
      toast({
        title: "Coming Soon",
        description:
          "Documents feature is in development. Please check the next release.",
      });
      return;
    }

    setActiveTab(tabId);
    if (tabId === "timeline" && !workflow && !workflowLoading) {
      fetchWorkflow();
    }
  };

  const handleTransactionUpdate = async (
    txUpdates: TransactionUpdatePayload
  ) => {
    if (!transaction || !updateTransaction) return;
    setStatusUpdating(true);
    try {
      await updateTransaction(txUpdates);
      if (txUpdates.status && Object.keys(txUpdates).length === 1) {
        toast({
          title: "Transaction updated",
          description: "Status updated successfully.",
          variant: "default",
        });
      }
    } catch (error) {
      throw error;
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    if (!transaction || transaction.status === newStatus) return;
    handleTransactionUpdate({ status: newStatus });
  };

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

  return {
    activeTab,
    setActiveTab,
    statusUpdating,
    handleTabChange,
    handleStatusChange,
    handleSaveNotes,
  };
}
