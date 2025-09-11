import { useState } from "react";
import { ItemStatus, Item, Workflow } from "@/types/workflow";
import type { ItemUpdatePayload } from "@/types/transactions/transactions";
import { useToast } from "@/hooks/use-toast";
import { ENDPOINTS } from "@/lib/constants";
import { apiClient } from "@/lib/api-internal";

export function useTransactionWorkflow(transactionId: string) {
  const { toast } = useToast();
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [workflowLoading, setWorkflowLoading] = useState(false);
  const [workflowError, setWorkflowError] = useState<string | null>(null);

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

  // Handler for updating workflow items
  const handleUpdateItem = async (
    itemId: string,
    itemUpdates: ItemUpdatePayload
  ) => {
    if (!transactionId) {
      toast({
        title: "Error",
        description: "Transaction not loaded. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await apiClient.patch<Item>(
        `${ENDPOINTS.internal.TRANSACTIONS}/${transactionId}/workflow/items/${itemId}`,
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

  return {
    workflow,
    workflowLoading,
    workflowError,
    fetchWorkflow,
    handleUpdateItem,
  };
}
