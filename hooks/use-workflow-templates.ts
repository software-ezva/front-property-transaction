import { useState, useEffect } from "react";
import { WorkflowTemplate, TransactionType } from "@/types/workflow-templates";
import {
  getTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  CreateWorkflowTemplateRequest,
  UpdateWorkflowTemplateRequest,
} from "@/lib/api/workflow-templates";

export function useWorkflowTemplates(transactionType?: TransactionType) {
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTemplates();

      // Filter by transaction type if provided
      const filteredData = transactionType
        ? data.filter(
            (template) => template.transactionType === transactionType
          )
        : data;

      setTemplates(filteredData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error loading workflow templates"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async (data: CreateWorkflowTemplateRequest) => {
    try {
      const newTemplate = await createTemplate(data);
      // Reload the list after creating
      await fetchTemplates();
      return newTemplate;
    } catch (err) {
      throw err;
    }
  };

  const handleUpdateTemplate = async (
    id: string,
    data: UpdateWorkflowTemplateRequest
  ) => {
    try {
      await updateTemplate(id, data);
      // Reload the list after updating
      await fetchTemplates();
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      await deleteTemplate(id);
      // Remove from local state
      setTemplates((prev) => prev.filter((template) => template.id !== id));
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [transactionType]);

  return {
    templates,
    loading,
    error,
    refetch: fetchTemplates,
    createTemplate: handleCreateTemplate,
    updateTemplate: handleUpdateTemplate,
    deleteTemplate: handleDeleteTemplate,
  };
}

/**
 * Hook for managing a single workflow template
 */
export function useWorkflowTemplate(id: string) {
  const [template, setTemplate] = useState<WorkflowTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplate = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTemplate(id);
      setTemplate(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error loading workflow template"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTemplate = async (data: UpdateWorkflowTemplateRequest) => {
    try {
      await updateTemplate(id, data);
      // Reload the template after updating
      await fetchTemplate();
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    if (id) {
      fetchTemplate();
    }
  }, [id]);

  return {
    template,
    loading,
    error,
    refetch: fetchTemplate,
    updateTemplate: handleUpdateTemplate,
  };
}
