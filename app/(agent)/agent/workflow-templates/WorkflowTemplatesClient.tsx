"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Copy,
  FileText,
  Settings,
} from "lucide-react";
import Button from "@/components/atoms/Button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { TransactionType } from "@/types/workflow-templates";
import TemplateCard from "@/components/molecules/TemplateCard";
import { useWorkflowTemplates } from "@/hooks/use-workflow-templates";
import PageTitle from "@/components/molecules/PageTitle";

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

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filteredTemplates = templates.filter(
    (t) =>
      (typeFilter === "all" || t.transactionType === typeFilter) &&
      t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id: string) => {
    // Usar Link en TemplateCard, no navegación directa aquí
    // window.location.href = `/agent/workflow-templates/${id}/edit`;
  };

  const handleDuplicate = async (template: Template) => {
    // TODO: Implement duplicate functionality with API call
    console.log("Duplicate template:", template.id);
    alert("Duplicate functionality will be implemented soon");
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this workflow template?")) {
      try {
        await deleteTemplate(id);
      } catch (error) {
        console.error("Error deleting template:", error);
      }
    }
  };

  // Usa directamente el valor del enum TransactionType como label
  const getTransactionTypeLabel = (type: string) => {
    return Object.values(TransactionType).includes(type as TransactionType)
      ? type
      : "N/A";
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-destructive">Error: {error}</p>
      </div>
    );
  }

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
        <Link href="/agent/workflow-templates/create" passHref legacyBehavior>
          <Button asChild className="sm:w-auto">
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
          <div className="bg-card rounded-lg p-12 border border-border text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Loading templates...
            </h3>
          </div>
        ) : filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                getTransactionTypeLabel={getTransactionTypeLabel}
                onEdit={handleEdit}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-lg p-12 border border-border text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No templates found
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || typeFilter !== "all"
                ? "No templates match your current filters."
                : "Create your first workflow template to get started."}
            </p>
            <Link
              href="/agent/workflow-templates/create"
              passHref
              legacyBehavior
            >
              <Button asChild>
                <a>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Template
                </a>
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
