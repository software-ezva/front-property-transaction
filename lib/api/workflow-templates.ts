import { apiClient } from "@/lib/api-internal";
import { ENDPOINTS } from "@/lib/constants";
import {
  WorkflowTemplate,
  TransactionType,
  CreateWorkflowTemplateData,
} from "@/types/workflow-templates";

export interface CreateWorkflowTemplateRequest {
  name: string;
  transactionType: TransactionType;
  checklistTemplates: Array<{
    name: string;
    description: string;
    order: number;
    items: Array<{
      description: string;
      order: number;
    }>;
  }>;
}

export interface CreateWorkflowTemplateResponse {
  id: string;
  message: string;
}

export interface UpdateWorkflowTemplateRequest {
  name?: string;
  transactionType?: TransactionType;
  checklistTemplates?: Array<{
    id?: string;
    name: string;
    description: string;
    order: number;
    items: Array<{
      id?: string;
      description: string;
      order: number;
    }>;
  }>;
}

/**
 * API Client for Workflow Templates
 */
export class WorkflowTemplateApiClient {
  /**
   * Get all workflow templates
   */
  static async getTemplates(): Promise<WorkflowTemplate[]> {
    const response = await apiClient.get<any[]>(ENDPOINTS.internal.TEMPLATES, {
      errorTitle: "Error loading workflow templates",
    });

    // Transform backend response to our internal type
    return response.map((template) => ({
      ...template,
      transactionType: template.transactionType as TransactionType,
      createdAt: new Date(template.createdAt),
      updatedAt: new Date(template.updatedAt),
      checklistTemplates:
        template.checklistTemplates?.map((checklist: any) => ({
          ...checklist,
          createdAt: new Date(checklist.createdAt),
          updatedAt: new Date(checklist.updatedAt),
          items:
            checklist.items?.map((item: any) => ({
              ...item,
              createdAt: new Date(item.createdAt),
              updatedAt: new Date(item.updatedAt),
            })) || [],
        })) || [],
    }));
  }

  /**
   * Get a specific workflow template by ID
   */
  static async getTemplate(id: string): Promise<WorkflowTemplate> {
    const response = await apiClient.get<any>(
      `${ENDPOINTS.internal.TEMPLATES}/${id}`,
      {
        errorTitle: "Error loading workflow template",
      }
    );

    // Transform backend response to our internal type
    return {
      ...response,
      transactionType: response.transactionType as TransactionType,
      createdAt: new Date(response.createdAt),
      updatedAt: new Date(response.updatedAt),
      checklistTemplates:
        response.checklistTemplates?.map((checklist: any) => ({
          ...checklist,
          createdAt: new Date(checklist.createdAt),
          updatedAt: new Date(checklist.updatedAt),
          items:
            checklist.items?.map((item: any) => ({
              ...item,
              createdAt: new Date(item.createdAt),
              updatedAt: new Date(item.updatedAt),
            })) || [],
        })) || [],
    };
  }

  /**
   * Create a new workflow template
   */
  static async createTemplate(
    data: CreateWorkflowTemplateRequest
  ): Promise<CreateWorkflowTemplateResponse> {
    return apiClient.post<CreateWorkflowTemplateResponse>(
      ENDPOINTS.internal.TEMPLATES,
      data,
      {
        errorTitle: "Error creating workflow template",
      }
    );
  }

  /**
   * Update a workflow template
   */
  static async updateTemplate(
    id: string,
    data: UpdateWorkflowTemplateRequest
  ): Promise<void> {
    await apiClient.patch(
      ENDPOINTS.internal.TEMPLATES,
      { id, ...data },
      {
        errorTitle: "Error updating workflow template",
      }
    );
  }

  /**
   * Delete a workflow template
   */
  static async deleteTemplate(id: string): Promise<void> {
    await apiClient.delete(`${ENDPOINTS.internal.TEMPLATES}/${id}`, {
      errorTitle: "Error deleting workflow template",
    });
  }
}

// Export individual methods for convenience
export const {
  getTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} = WorkflowTemplateApiClient;
