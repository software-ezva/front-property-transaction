import { useState, useEffect } from "react";
import {
  DocumentTemplate,
  DocumentCategory,
  CreateDocumentTemplateRequest,
} from "@/types/document-templates";
import {
  getTemplates,
  getTemplate,
  createTemplate,
  deleteTemplate,
} from "@/lib/api/document-templates";

export function useDocumentTemplates(category?: DocumentCategory) {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTemplates(category);
      setTemplates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading templates");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async (data: CreateDocumentTemplateRequest) => {
    try {
      const newTemplate = await createTemplate(data);
      // Reload the list after creating
      await fetchTemplates();
      return newTemplate;
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteTemplate = async (uuid: string) => {
    try {
      await deleteTemplate(uuid);
      // Remove from local state
      setTemplates((prev) => prev.filter((template) => template.uuid !== uuid));
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [category]);

  return {
    templates,
    loading,
    error,
    refetch: fetchTemplates,
    createTemplate: handleCreateTemplate,
    deleteTemplate: handleDeleteTemplate,
  };
}

// Hook específico para obtener un template individual con URL segura
export function useDocumentTemplate(id: string | null) {
  const [template, setTemplate] = useState<DocumentTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTemplate = async (templateId: string) => {
    setLoading(true);
    setError(null);

    try {
      const templateData = await getTemplate(templateId);
      setTemplate(templateData);
      return templateData;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error loading template";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadTemplate(id);
    }
  }, [id]);

  return {
    template,
    loading,
    error,
    loadTemplate,
  };
}
