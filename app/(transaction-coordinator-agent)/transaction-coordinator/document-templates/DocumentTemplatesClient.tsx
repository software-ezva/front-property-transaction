"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Eye,
  Trash2,
  FileText,
  X,
  Calendar,
  Tag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import DashboardLayout from "@/components/templates/DashboardLayout";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import PageTitle from "@/components/molecules/PageTitle";
import LoadingState from "@/components/molecules/LoadingState";
import ErrorState from "@/components/molecules/ErrorState";
import EmptyState from "@/components/molecules/EmptyState";
import ConfirmationDialog from "@/components/molecules/ConfirmationDialog";
import PDFViewer from "@/components/molecules/PDFViewer";
import {
  DocumentCategory,
  type DocumentTemplate,
} from "@/types/document-templates";
import {
  useDocumentTemplates,
  useDocumentTemplate,
} from "@/hooks/use-document-templates";

export default function DocumentTemplatesClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { templates, loading, error, deleteTemplate } = useDocumentTemplates();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<
    DocumentCategory | "all"
  >("all");
  const [selectedTemplate, setSelectedTemplate] =
    useState<DocumentTemplate | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // Hook para cargar el template individual con URL
  const {
    template: templateWithUrl,
    loading: templateLoading,
    error: templateError,
  } = useDocumentTemplate(selectedTemplateId);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] =
    useState<DocumentTemplate | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Efecto para abrir automáticamente un template específico basado en URL params
  useEffect(() => {
    const viewTemplateUuid = searchParams.get("viewTemplate");
    if (viewTemplateUuid && templates.length > 0) {
      const templateToView = templates.find(
        (template) => template.uuid === viewTemplateUuid
      );
      if (templateToView) {
        setSelectedTemplate(templateToView);
        setIsViewerOpen(true);
      }
    }
  }, [searchParams, templates]);

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || template.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleView = (template: DocumentTemplate) => {
    setSelectedTemplate(template); // Template básico sin URL
    setSelectedTemplateId(template.uuid); // Esto activará el hook para cargar con URL
    setIsViewerOpen(true);
  };

  const handleDeleteClick = (template: DocumentTemplate) => {
    setTemplateToDelete(template);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!templateToDelete) return;

    setIsDeleting(true);
    try {
      await deleteTemplate(templateToDelete.uuid);
      setIsDeleteDialogOpen(false);
      setTemplateToDelete(null);
      // State will be updated automatically by the hook
    } catch (error) {
      console.error("Error deleting template:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setTemplateToDelete(null);
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setSelectedTemplate(null);
    setSelectedTemplateId(null); // Limpiar para detener el hook
  };

  const getCategoryVariant = (category: DocumentCategory) => {
    const variants = {
      [DocumentCategory.CONTRACT_AND_NEGOTIATION]: "success" as const,
      [DocumentCategory.TITLE_AND_OWNERSHIP]: "warning" as const,
      [DocumentCategory.DISCLOSURE]: "error" as const,
      [DocumentCategory.CLOSING_AND_FINANCING]: "default" as const,
      [DocumentCategory.AGREEMENTS]: "success" as const,
      [DocumentCategory.LISTINGS_AND_MARKETING]: "warning" as const,
      [DocumentCategory.PROPERTY_MANAGEMENT]: "default" as const,
      [DocumentCategory.INSURANCE]: "error" as const,
      [DocumentCategory.MISCELLANEOUS]: "default" as const,
    };
    return variants[category];
  };

  const getTemplatesByCategory = (category: DocumentCategory) => {
    return templates.filter((t) => t.category === category).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <PageTitle
            title="Document Templates"
            subtitle="Manage document templates for real estate transactions"
          />
        </div>
        <Button
          onClick={() =>
            (window.location.href =
              "/transaction-coordinator/document-templates/create")
          }
          className="sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Template
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg p-4 border border-border text-center">
          <div className="text-2xl font-bold text-foreground">
            {templates.length}
          </div>
          <div className="text-sm text-muted-foreground">Total Templates</div>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border text-center">
          <div className="text-2xl font-bold text-foreground">
            {getTemplatesByCategory(DocumentCategory.CONTRACT_AND_NEGOTIATION)}
          </div>
          <div className="text-sm text-muted-foreground">Contracts</div>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border text-center">
          <div className="text-2xl font-bold text-foreground">
            {getTemplatesByCategory(DocumentCategory.DISCLOSURE)}
          </div>
          <div className="text-sm text-muted-foreground">Disclosures</div>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border text-center">
          <div className="text-2xl font-bold text-foreground">
            {getTemplatesByCategory(DocumentCategory.CLOSING_AND_FINANCING)}
          </div>
          <div className="text-sm text-muted-foreground">Closing</div>
        </div>
      </div>

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
          <div className="flex gap-2">
            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value as DocumentCategory | "all")
              }
              className="px-3 py-2 border border-input rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Categories</option>
              {Object.values(DocumentCategory).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <LoadingState
            title="Loading templates..."
            description="Please wait while we load your document templates."
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
          <div className="bg-card rounded-lg border border-border">
            <div className="divide-y divide-border">
              {filteredTemplates.map((template) => (
                <div
                  key={template.uuid}
                  className="p-3 hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <FileText className="w-6 h-6 text-muted-foreground" />
                        <h3 className="text-base font-semibold text-foreground">
                          {template.title}
                        </h3>
                        <Badge variant={getCategoryVariant(template.category)}>
                          {template.category}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-3 text-xs text-muted-foreground ml-7">
                        <span>
                          Created {template.createdAt.toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span>
                          Updated {template.updatedAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(template)}
                        title="View template"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(template)}
                        title="Delete template"
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            title="No templates found"
            description={
              searchTerm || categoryFilter !== "all"
                ? "No templates match your current filters."
                : "Create your first document template to get started."
            }
            icon={FileText}
            actionLabel="Add Template"
            onAction={() =>
              (window.location.href =
                "/transaction-coordinator/document-templates/create")
            }
          />
        )}
      </div>

      {isViewerOpen && selectedTemplate && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center z-50 px-16 py-10 overflow-hidden"
          style={{ margin: 0 }}
        >
          <div className="bg-card rounded-lg border border-border w-full h-full max-w-[98vw] max-h-[98vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 lg:p-6 border-b border-border bg-card rounded-t-lg flex-shrink-0">
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-primary" />
                <div>
                  <h2 className="text-xl lg:text-2xl font-semibold text-foreground">
                    {selectedTemplate.title}
                  </h2>
                  <Badge
                    variant={getCategoryVariant(selectedTemplate.category)}
                    className="mt-1"
                  >
                    {selectedTemplate.category}
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseViewer}
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-hidden flex min-h-0">
              {/* Document Info Sidebar */}
              <div
                className={`${
                  isSidebarCollapsed ? "w-0" : "w-72 lg:w-80"
                } transition-all duration-300 overflow-hidden border-r border-border bg-muted/5`}
              >
                <div className="w-72 lg:w-80 p-3 lg:p-4 h-full overflow-y-auto">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center">
                        <Tag className="w-4 h-4 mr-2 text-primary" />
                        Document Details
                      </h3>
                      <div className="space-y-2">
                        <div className="bg-muted/20 p-2 rounded-md">
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Title
                          </label>
                          <p className="text-sm text-foreground mt-1 font-medium">
                            {selectedTemplate.title}
                          </p>
                        </div>
                        <div className="bg-muted/20 p-2 rounded-md">
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Category
                          </label>
                          <p className="text-sm text-foreground mt-1 font-medium">
                            {selectedTemplate.category}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-primary" />
                        Timeline
                      </h3>
                      <div className="space-y-2">
                        <div className="bg-muted/20 p-2 rounded-md">
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Created
                          </label>
                          <p className="text-sm text-foreground mt-1 font-medium">
                            {selectedTemplate.createdAt.toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        <div className="bg-muted/20 p-2 rounded-md">
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Last Updated
                          </label>
                          <p className="text-sm text-foreground mt-1 font-medium">
                            {selectedTemplate.updatedAt.toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-primary" />
                        Actions
                      </h3>
                      <div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() =>
                            selectedTemplate &&
                            handleDeleteClick(selectedTemplate)
                          }
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Template
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Preview */}
              <div className="flex-1 p-4 lg:p-6 pr-12 lg:pr-16 relative bg-muted/5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="absolute top-4 left-4 z-10 bg-background border border-border shadow-md hover:shadow-lg transition-all duration-200"
                  title={
                    isSidebarCollapsed
                      ? "Show document details"
                      : "Hide document details"
                  }
                  aria-label={
                    isSidebarCollapsed
                      ? "Show document details"
                      : "Hide document details"
                  }
                >
                  {isSidebarCollapsed ? (
                    <ChevronRight className="w-4 h-4" />
                  ) : (
                    <ChevronLeft className="w-4 h-4" />
                  )}
                </Button>

                {/* PDF Viewer */}
                <div className="h-full w-full ml-12">
                  {templateLoading ? (
                    <div className="h-full flex items-center justify-center">
                      <LoadingState
                        title="Loading document..."
                        description="Please wait while we load the document details"
                        icon={FileText}
                      />
                    </div>
                  ) : templateError ? (
                    <div className="h-full flex items-center justify-center">
                      <ErrorState
                        title="Error Loading Document"
                        error={templateError}
                        onRetry={() => window.location.reload()}
                        icon={FileText}
                      />
                    </div>
                  ) : templateWithUrl?.url ? (
                    <PDFViewer
                      documentUrl={templateWithUrl.url}
                      documentTitle={templateWithUrl.title}
                      allowDownload={true}
                      allowFullscreen={true}
                      className="h-full"
                      onError={(error) => {
                        // Error handled by PDFViewer component internally
                      }}
                      onLoad={() => {
                        // PDF loaded successfully
                      }}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          No Document Available
                        </h3>
                        <p className="text-muted-foreground">
                          This template doesn&apos;t have a valid document URL.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Document Template"
        message={
          templateToDelete
            ? `Are you sure you want to permanently delete "${templateToDelete.title}"?\n\nThis action cannot be undone and will remove the template and its associated file from storage.`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        icon={<Trash2 className="w-6 h-6 text-destructive" />}
        isLoading={isDeleting}
      />
    </div>
  );
}
