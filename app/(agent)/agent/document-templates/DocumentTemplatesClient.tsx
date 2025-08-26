"use client";

import { useState } from "react";
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
import {
  DocumentCategory,
  type DocumentTemplate,
} from "@/types/document-templates";

const mockDocumentTemplates: DocumentTemplate[] = [
  {
    uuid: "dt-1",
    title: "Purchase Agreement Template",
    category: DocumentCategory.CONTRACT_AND_NEGOTIATION,
    url: "/documents/purchase-agreement.pdf",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    uuid: "dt-2",
    title: "Property Disclosure Form",
    category: DocumentCategory.DISCLOSURE,
    url: "/documents/disclosure-form.pdf",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    uuid: "dt-3",
    title: "Listing Agreement",
    category: DocumentCategory.LISTINGS_AND_MARKETING,
    url: "/documents/listing-agreement.pdf",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-25"),
  },
  {
    uuid: "dt-4",
    title: "Title Insurance Policy",
    category: DocumentCategory.TITLE_AND_OWNERSHIP,
    url: "/documents/title-insurance.pdf",
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-22"),
  },
  {
    uuid: "dt-5",
    title: "Closing Statement",
    category: DocumentCategory.CLOSING_AND_FINANCING,
    url: "/documents/closing-statement.pdf",
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-15"),
  },
];

export default function DocumentTemplatesClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<
    DocumentCategory | "all"
  >("all");
  const [templates, setTemplates] = useState<DocumentTemplate[]>(
    mockDocumentTemplates
  );
  const [selectedTemplate, setSelectedTemplate] =
    useState<DocumentTemplate | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || template.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleView = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setIsViewerOpen(true);
  };

  const handleDelete = (templateUuid: string) => {
    if (confirm("Are you sure you want to delete this document template?")) {
      setTemplates(templates.filter((t) => t.uuid !== templateUuid));
    }
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setSelectedTemplate(null);
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
          <h1 className="text-3xl font-bold text-foreground font-primary">
            Document Templates
          </h1>
          <p className="text-muted-foreground font-secondary">
            Manage document templates for real estate transactions
          </p>
        </div>
        <Button
          onClick={() =>
            (window.location.href = "/agent/document-templates/create")
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
        {filteredTemplates.length > 0 ? (
          <div className="bg-card rounded-lg border border-border">
            <div className="divide-y divide-border">
              {filteredTemplates.map((template) => (
                <div
                  key={template.uuid}
                  className="p-4 hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <h3 className="text-lg font-semibold text-foreground">
                          {template.title}
                        </h3>
                        <Badge variant={getCategoryVariant(template.category)}>
                          {template.category}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground ml-8">
                        <span>
                          Created {template.createdAt.toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span>
                          Updated {template.updatedAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
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
                        onClick={() => handleDelete(template.uuid)}
                        title="Delete template"
                        className="text-destructive hover:text-destructive"
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
          <div className="bg-card rounded-lg p-12 border border-border text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No templates found
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || categoryFilter !== "all"
                ? "No templates match your current filters."
                : "Create your first document template to get started."}
            </p>
            <Button
              onClick={() =>
                (window.location.href = "/agent/document-templates/create")
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Template
            </Button>
          </div>
        )}
      </div>

      {isViewerOpen && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-muted-foreground" />
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
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
              <Button variant="ghost" size="sm" onClick={handleCloseViewer}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-hidden flex">
              {/* Document Info Sidebar */}
              <div
                className={`${
                  isSidebarCollapsed ? "w-0" : "w-80"
                } transition-all duration-300 overflow-hidden border-r border-border bg-muted/20`}
              >
                <div className="w-80 p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
                        <Tag className="w-4 h-4 mr-2" />
                        Document Details
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Title
                          </label>
                          <p className="text-sm text-foreground mt-1">
                            {selectedTemplate.title}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Category
                          </label>
                          <p className="text-sm text-foreground mt-1">
                            {selectedTemplate.category}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Timeline
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Created
                          </label>
                          <p className="text-sm text-foreground mt-1">
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
                        <div>
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Last Updated
                          </label>
                          <p className="text-sm text-foreground mt-1">
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
                  </div>
                </div>
              </div>

              {/* Document Preview */}
              <div className="flex-1 p-6 relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="absolute top-4 left-4 z-10 bg-card border border-border shadow-sm"
                  title={isSidebarCollapsed ? "Show details" : "Hide details"}
                >
                  {isSidebarCollapsed ? (
                    <ChevronRight className="w-4 h-4" />
                  ) : (
                    <ChevronLeft className="w-4 h-4" />
                  )}
                </Button>

                <div className="h-full bg-muted/10 rounded-lg border border-border flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Document Preview
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Preview functionality will be implemented with document
                      viewer integration
                    </p>
                    <div className="text-sm text-muted-foreground">
                      <p>File URL: {selectedTemplate.url}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
