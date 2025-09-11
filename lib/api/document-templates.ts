import { apiClient, apiFetch } from "@/lib/api-internal";
import { ENDPOINTS } from "@/lib/constants";
import {
  DocumentTemplate,
  DocumentCategory,
  CreateDocumentTemplateRequest,
  CreateDocumentTemplateResponse,
} from "@/types/document-templates";

/**
 * API Client for Document Templates
 */
export class DocumentTemplateApiClient {
  /**
   * Create a new document template
   */
  static async createTemplate(
    data: CreateDocumentTemplateRequest
  ): Promise<CreateDocumentTemplateResponse> {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("category", data.category);
    formData.append("file", data.file);

    return apiFetch<CreateDocumentTemplateResponse>(
      ENDPOINTS.internal.DOCUMENT_TEMPLATES,
      {
        method: "POST",
        body: formData,
        errorTitle: "Error creating template",
      }
    );
  }

  /**
   * Get all document templates
   */
  static async getTemplates(
    category?: DocumentCategory
  ): Promise<DocumentTemplate[]> {
    let url = ENDPOINTS.internal.DOCUMENT_TEMPLATES;
    if (category) {
      url += `?category=${encodeURIComponent(category)}`;
    }

    const response = await apiClient.get<CreateDocumentTemplateResponse[]>(
      url,
      {
        errorTitle: "Error loading templates",
      }
    );

    // Transform backend response to our internal type
    return response.map((template) => ({
      ...template,
      category: template.category as DocumentCategory,
      createdAt: new Date(template.createdAt),
      updatedAt: new Date(template.updatedAt),
    }));
  }

  /**
   * Get a specific template by UUID
   */
  static async getTemplate(uuid: string): Promise<DocumentTemplate> {
    const response = await apiClient.get<CreateDocumentTemplateResponse>(
      `${ENDPOINTS.internal.DOCUMENT_TEMPLATES}/${uuid}`,
      {
        errorTitle: "Error loading template",
      }
    );

    return {
      ...response,
      category: response.category as DocumentCategory,
      createdAt: new Date(response.createdAt),
      updatedAt: new Date(response.updatedAt),
    };
  }

  /**
   * Delete a template permanently
   */
  static async deleteTemplate(uuid: string): Promise<void> {
    await apiClient.delete(`${ENDPOINTS.internal.DOCUMENT_TEMPLATES}/${uuid}`, {
      errorTitle: "Error deleting template",
    });
  }
}

// Export individual methods for convenience
export const { createTemplate, getTemplates, getTemplate, deleteTemplate } =
  DocumentTemplateApiClient;
