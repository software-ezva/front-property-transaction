"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, FileText } from "lucide-react";
import Button from "@/components/atoms/Button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { TransactionType } from "@/types/workflow-templates";
import TemplateCard from "@/components/molecules/TemplateCard";
import { useWorkflowTemplates } from "@/hooks/use-workflow-templates";
import PageTitle from "@/components/molecules/PageTitle";
import ConfirmationDialog from "@/components/molecules/ConfirmationDialog";
import EmptyState from "@/components/molecules/EmptyState";
import ErrorState from "@/components/molecules/ErrorState";
import { LoadingState } from "@/components/molecules";

type Template = {
  id: string;
  name: string;
  transactionType: string;
  checklistTemplates: Array<{ name: string; taskCount?: number }>;
};

export default function WorkflowTemplatesClient() {
  const {
    templates,
    loading: loadingTemplates,
    error,
    deleteTemplate,
  } = useWorkflowTemplates();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredTemplates = templates.filter(
    (t) =>
      (typeFilter === "all" || t.transactionType === typeFilter) &&
      t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id: string) => {
    router.push(`/transaction-coordinator/workflow-templates/${id}/edit`);
  };

  const handleDuplicate = async (template: Template) => {
    router.push(
      `/transaction-coordinator/workflow-templates/create?duplicateId=${template.id}`
    );
  };

  const handleDelete = (id: string) => {
    setTemplateToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (templateToDelete) {
      setIsDeleting(true);
      try {
        await deleteTemplate(templateToDelete);
        setDeleteDialogOpen(false);
        setTemplateToDelete(null);
      } catch (error) {
        console.error("Error deleting template:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Usa directamente el valor del enum TransactionType como label
  const getTransactionTypeLabel = (type: string) => {
    return Object.values(TransactionType).includes(type as TransactionType)
      ? type
      : "N/A";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <PageTitle
            title="Workflow Templates"
            subtitle="Manage workflow templates for different transaction types"
          />
        </div>
        <Link href="/transaction-coordinator/workflow-templates/create">
          <Button className="sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Types</option>
              {Object.values(TransactionType).map((type) => (
                <option key={type} value={type}>
                  {getTransactionTypeLabel(type)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="space-y-4">
        {loadingTemplates ? (
          <LoadingState
            title="Loading templates..."
            description="Please wait while we load your workflow templates."
            icon={FileText}
          />
        ) : error ? (
          <ErrorState
            title="Error Loading Templates"
            error={error}
            onRetry={() => window.location.reload()}
            icon={FileText}
          />
        ) : filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                getTransactionTypeLabel={getTransactionTypeLabel}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No templates found"
            description={
              searchTerm || typeFilter !== "all"
                ? "No templates match your current filters."
                : "Create your first workflow template to get started."
            }
            icon={FileText}
            actionLabel="Create Template"
            onAction={() =>
              router.push("/transaction-coordinator/workflow-templates/create")
            }
          />
        )}
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
