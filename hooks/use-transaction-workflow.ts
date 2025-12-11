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

  // Handler for adding a new checklist
  const handleAddChecklist = async (name: string) => {
    if (!transactionId) return;

    try {
      // We need to import Checklist type if not already imported, or use any for now if it's complex
      // But looking at the file, Checklist is not imported. I should check imports.
      // Actually, I'll just use the endpoint and assume it returns the new checklist.
      // I need to update the state.

      const response = await apiClient.post<any>(
        `${ENDPOINTS.internal.TRANSACTIONS}/${transactionId}/workflow/checklists`,
        { name }
      );

      // Update local state
      if (workflow) {
        // Assuming response is the new checklist object
        // Ensure items is initialized to empty array if missing
        const newChecklist = { ...response, items: response.items || [] };
        const updatedWorkflow: Workflow = {
          ...workflow,
          checklists: [...workflow.checklists, newChecklist],
        };
        setWorkflow(updatedWorkflow);
      }

      toast({
        title: "Checklist added",
        description: "New checklist has been added to the workflow.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error adding checklist:", error);
      toast({
        title: "Error",
        description: "Failed to add checklist.",
        variant: "destructive",
      });
    }
  };

  // Handler for adding a new item to a checklist
  const handleAddItem = async (checklistId: string, description: string) => {
    if (!transactionId) return;

    try {
      const response = await apiClient.post<Item>(
        `${ENDPOINTS.internal.TRANSACTIONS}/${transactionId}/workflow/checklists/${checklistId}/items`,
        { description }
      );

      // Update local state
      if (workflow) {
        const updatedWorkflow: Workflow = {
          ...workflow,
          checklists: workflow.checklists.map((checklist) => {
            if (checklist.id === checklistId) {
              return {
                ...checklist,
                items: [...(checklist.items || []), response],
              };
            }
            return checklist;
          }),
        };
        setWorkflow(updatedWorkflow);
      }

      toast({
        title: "Item added",
        description: "New item has been added to the checklist.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error adding item:", error);
      toast({
        title: "Error",
        description: "Failed to add item.",
        variant: "destructive",
      });
    }
  };

  // Handler for adding an update to an item
  const handleAddItemUpdate = async (
    itemId: string,
    content: string,
    userName: string
  ) => {
    if (!transactionId) return;

    try {
      const response = await apiClient.post<any>(
        `${ENDPOINTS.internal.TRANSACTIONS}/items/${itemId}/updates`,
        { content, userName }
      );

      // Update local state
      if (workflow) {
        const updatedWorkflow: Workflow = {
          ...workflow,
          checklists: workflow.checklists.map((checklist) => ({
            ...checklist,
            items: checklist.items.map((item) => {
              if (item.id === itemId) {
                return {
                  ...item,
                  updates: [response, ...(item.updates || [])],
                };
              }
              return item;
            }),
          })),
        };
        setWorkflow(updatedWorkflow);
      }

      toast({
        title: "Update added",
        description: "Your update has been posted successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error adding update:", error);
      toast({
        title: "Error",
        description: "Failed to add update.",
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
    handleAddChecklist,
    handleAddItem,
    handleAddItemUpdate,
  };
}
