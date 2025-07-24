"use client";

import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Copy,
  FileText,
  Settings,
} from "lucide-react";
import DashboardLayout from "@/components/templates/DashboardLayout";
import Button from "@/components/atoms/Button";
import { Input } from "@/components/ui/input";
import { TransactionType } from "@/types/workflow-templates";
import TemplateCard from "@/components/molecules/TemplateCard";
import { ENDPOINTS } from "@/lib/constants";
import PageTitle from "@/components/molecules/PageTitle";

type Template = {
  id: string;
  name: string;
  transactionType: string;
  checklistTemplates: Array<{ name: string; taskCount?: number }>;
};

function WorkflowTemplatesClient() {
  const { user, isLoading } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch templates from API
  useEffect(() => {
    setLoadingTemplates(true);
    setError(null);
    fetch(ENDPOINTS.internal.TEMPLATES)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch templates");
        return res.json();
      })
      .then((data) => setTemplates(data))
      .catch((err) => setError(err.message || "Unknown error"))
      .finally(() => setLoadingTemplates(false));
  }, []);

  const filteredTemplates = templates.filter(
    (t) =>
      (typeFilter === "all" || t.transactionType === typeFilter) &&
      t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id: string) => {
    window.location.href = `/agent/workflow-templates/${id}/edit`;
  };

  const handleDuplicate = (template: Template) => {
    setTemplates((prev) => [
      ...prev,
      {
        ...template,
        id: `wt-${Date.now()}`,
        name: `${template.name} (Copy)`,
        checklistTemplates: template.checklistTemplates.map((c) => ({
          ...c,
          name: `${c.name} (Copy)`,
        })),
      },
    ]);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this workflow template?")) {
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    }
  };

  // Usa directamente el valor del enum TransactionType como label
  const getTransactionTypeLabel = (type: string) => {
    return Object.values(TransactionType).includes(type as TransactionType)
      ? type
      : "N/A";
  };

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>No user session found.</div>;
  if (!user.profile) return <div>No agent profile found.</div>;

  const agentProfile = user.profile as {
    esignName: string;
    esignInitials: string;
    licenseNumber: string;
    profileType: string;
  };
  const agentUserForHeader = {
    name:
      `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() ||
      user.name ||
      "",
    profile: agentProfile.profileType?.replace(/_/g, " ") || "agent",
    avatar: String(user.picture) || "",
  };

  // No loading page-wide, loading will be shown in the grid below
  if (error)
    return (
      <div className="bg-destructive/10 border border-destructive rounded-lg p-4 text-destructive text-center">
        {error}
      </div>
    );

  return (
    <DashboardLayout user={agentUserForHeader}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <PageTitle
              title="Workflow Templates"
              subtitle="Manage workflow templates for different transaction types"
            />
          </div>
          <Button
            onClick={() =>
              (window.location.href = "/agent/workflow-templates/create")
            }
            className="sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
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
              <Button
                onClick={() =>
                  (window.location.href = "/agent/workflow-templates/create")
                }
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default WorkflowTemplatesClient;
