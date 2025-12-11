"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Copy,
  Trash2,
  ChevronDown,
  ChevronRight,
  FileX,
} from "lucide-react";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Link from "next/link";
import {
  TransactionType,
  type WorkflowTemplate,
} from "@/types/workflow-templates";
import ReturnTo from "@/components/molecules/ReturnTo";
import PageTitle from "@/components/molecules/PageTitle";
import { useTransactionCoordinatorAgentAuth } from "@/hooks/use-transaction-coordinator-agent-auth";
import { useWorkflowTemplate } from "@/hooks/use-workflow-templates";
import { deleteTemplate } from "@/lib/api/workflow-templates";
import { ENDPOINTS } from "@/lib/constants";
import ConfirmationDialog from "@/components/molecules/ConfirmationDialog";
import LoadingState from "@/components/molecules/LoadingState";
import EmptyState from "@/components/molecules/EmptyState";

export interface WorkflowTemplateDetailsClientProps {
  templateId: string;
}

export default function WorkflowTemplateDetailsClient({
  templateId,
}: WorkflowTemplateDetailsClientProps) {
  const router = useRouter();
  const {
    user,
    isLoading,
    error: authError,
  } = useTransactionCoordinatorAgentAuth();
  const {
    template,
    loading: loadingTemplate,
    error,
  } = useWorkflowTemplate(templateId);

  const [expandedChecklists, setExpandedChecklists] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Initialize expanded checklists when template loads
  useEffect(() => {
    if (template?.checklistTemplates) {
      setExpandedChecklists(template.checklistTemplates.map((c) => c.id));
    }
  }, [template]);

  if (isLoading || loadingTemplate) {
    return <LoadingState title="Loading template details..." />;
  }

  if (authError) return <div>Error loading user data</div>;
  if (!user) return <div>Please log in</div>;

  if (error) {
    return (
      <EmptyState
        title="Error"
        description={error}
        icon={FileX}
        actionLabel="Back to Templates"
        onAction={() =>
          router.push("/transaction-coordinator/workflow-templates")
        }
      />
    );
  }

  if (!template) {
    return (
      <EmptyState
        title="No data available"
        description="No workflow template details could be loaded. Please check the template ID or try again later."
        icon={FileX}
        actionLabel="Back to Templates"
        onAction={() =>
          router.push("/transaction-coordinator/workflow-templates")
        }
      />
    );
  }
  // checklistTemplates fallback: if missing, treat as empty array
  const checklistTemplates = Array.isArray(template?.checklistTemplates)
    ? template.checklistTemplates
    : [];

  const toggleChecklistExpansion = (checklistId: string) => {
    setExpandedChecklists((prev) =>
      prev.includes(checklistId)
        ? prev.filter((id) => id !== checklistId)
        : [...prev, checklistId]
    );
  };

  const handleEdit = () => {
    router.push(
      `/transaction-coordinator/workflow-templates/${templateId}/edit`
    );
  };

  const handleDuplicate = () => {
    router.push(
      `/transaction-coordinator/workflow-templates/create?duplicateId=${templateId}`
    );
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTemplate(templateId);
      router.push("/transaction-coordinator/workflow-templates");
    } catch (error) {
      console.error("Error deleting template:", error);
      alert("Failed to delete template");
      setIsDeleting(false);
    }
  };

  const getTotalTasks = () => {
    return checklistTemplates.reduce(
      (total, checklist) =>
        total + (Array.isArray(checklist.items) ? checklist.items.length : 0),
      0
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className=" space-x-4">
          <ReturnTo
            href="/transaction-coordinator/workflow-templates"
            label="Back to Templates"
          />
          <PageTitle
            title={template.name}
            subtitle="Workflow Template Details"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Badge>{template.transactionType}</Badge>
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={handleDuplicate}>
            <Copy className="w-4 h-4 mr-2" />
            Duplicate
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Template Overview */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Template Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {checklistTemplates.length}
            </div>
            <div className="text-sm text-muted-foreground">Checklists</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary">
              {getTotalTasks()}
            </div>
            <div className="text-sm text-muted-foreground">Total Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-tertiary">
              {new Date(template.createdAt).toLocaleDateString()}
            </div>
            <div className="text-sm text-muted-foreground">Created</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">
              {new Date(template.updatedAt).toLocaleDateString()}
            </div>
            <div className="text-sm text-muted-foreground">Last Updated</div>
          </div>
        </div>
      </div>

      {/* Workflow Structure */}
      <div className="bg-card rounded-lg border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            Workflow Structure
          </h2>
          <p className="text-muted-foreground">
            Detailed breakdown of checklists and tasks
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {checklistTemplates
              .filter((c) => c && typeof c === "object")
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .map((checklist, checklistIndex) => {
                const isExpanded = expandedChecklists.includes(checklist.id);

                return (
                  <div key={checklist.id} className="relative">
                    {/* Vertical line connecting checklists */}
                    {checklistIndex < checklistTemplates.length - 1 && (
                      <div className="absolute left-6 top-16 w-0.5 h-16 bg-border" />
                    )}

                    {/* Checklist Header */}
                    <div
                      className="flex items-center space-x-4 cursor-pointer hover:bg-muted/30 rounded-lg p-3 transition-colors"
                      onClick={() => toggleChecklistExpansion(checklist.id)}
                    >
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-primary-foreground text-xs font-bold">
                            {checklist.order}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">
                              {checklist.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {checklist.description}
                            </p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-muted-foreground">
                              {Array.isArray(checklist.items)
                                ? checklist.items.length
                                : 0}{" "}
                              tasks
                            </span>
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Checklist Items */}
                    {isExpanded && Array.isArray(checklist.items) && (
                      <div className="ml-10 mt-4 space-y-2">
                        {checklist.items.length === 0 ? (
                          <div className="text-muted-foreground italic text-sm">
                            No tasks in this checklist.
                          </div>
                        ) : (
                          checklist.items
                            .filter((i) => i && typeof i === "object")
                            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                            .map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20"
                              >
                                <div className="flex-shrink-0">
                                  <div className="w-5 h-5 bg-muted rounded-full flex items-center justify-center">
                                    <span className="text-muted-foreground text-xs">
                                      {item.order}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm text-foreground">
                                    {item.description}
                                  </p>
                                </div>
                              </div>
                            ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Template"
        message="Are you sure you want to delete this workflow template? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  );
}
