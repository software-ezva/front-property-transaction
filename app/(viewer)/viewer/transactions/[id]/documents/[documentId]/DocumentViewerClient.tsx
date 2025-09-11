"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  AlertCircle,
  Edit3,
} from "lucide-react";
import Button from "@/components/atoms/Button";
import CustomBadge from "@/components/atoms/Badge";
import PageTitle from "@/components/molecules/PageTitle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DocumentStatus,
  DocumentCategory,
  type Document,
} from "@/types/documents";
import { useDocumentViewer } from "@/hooks/use-document-viewer";

const getBadgeVariant = (
  status: DocumentStatus
): "default" | "success" | "warning" | "error" => {
  switch (status) {
    case DocumentStatus.PENDING:
      return "warning";
    case DocumentStatus.WAITING:
      return "warning";
    case DocumentStatus.SIGNED:
      return "success";
    case DocumentStatus.READY:
      return "success";
    case DocumentStatus.REJECTED:
      return "error";
    case DocumentStatus.ARCHIVED:
      return "default";
    default:
      return "default";
  }
};

interface DocumentViewerClientProps {
  transactionId: string;
  documentId: string;
}

export default function DocumentViewerClient({
  transactionId,
  documentId,
}: DocumentViewerClientProps) {
  const router = useRouter();
  const [isDetailsSidebarCollapsed, setIsDetailsSidebarCollapsed] =
    useState(false);

  // Use the custom hook to fetch document data
  const { document, loading, error, refetch } = useDocumentViewer(
    transactionId,
    documentId
  );

  const handleStatusChange = (newStatus: string) => {
    // Handle status change logic here
    console.log("Status changed to:", newStatus);
  };

  const handleEditDocument = () => {
    router.push(
      `/agent/transactions/${transactionId}/documents/${documentId}/edit`
    );
  };

  const handleClose = () => {
    window.close();
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading document...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !document) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Document Not Found
          </h3>
          <p className="text-muted-foreground mb-4">
            {error || "Unable to load the requested document."}
          </p>
          <div className="space-x-2">
            <Button variant="outline" onClick={refetch}>
              Try Again
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-8 h-8 text-primary" />
              <PageTitle title={document.title} />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <CustomBadge variant={getBadgeVariant(document.status)}>
              {document.status}
            </CustomBadge>
            <Button
              variant="primary"
              size="sm"
              onClick={handleEditDocument}
              className="flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Edit Document
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground"
            >
              Close
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Collapsible Details Sidebar */}
        <div
          className={`${
            isDetailsSidebarCollapsed ? "w-0" : "w-72"
          } transition-all duration-300 overflow-hidden border-r border-border bg-muted/20`}
        >
          <div className="p-4 h-full overflow-y-auto">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Document Details
                </h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-muted-foreground">
                      Status
                    </span>
                    <div className="mt-1">
                      <CustomBadge variant={getBadgeVariant(document.status)}>
                        {document.status}
                      </CustomBadge>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-muted-foreground">
                      Category
                    </span>
                    <p className="text-sm text-foreground mt-1">
                      {document.category}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs text-muted-foreground">
                      Created
                    </span>
                    <p className="text-sm text-foreground mt-1">
                      {format(document.createdAt, "MMM dd, yyyy 'at' h:mm a")}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs text-muted-foreground">
                      Last Updated
                    </span>
                    <p className="text-sm text-foreground mt-1">
                      {format(document.updatedAt, "MMM dd, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Actions
                </h4>
                <div className="space-y-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleEditDocument}
                    className="w-full flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Document
                  </Button>

                  <Select
                    defaultValue={document.status}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger className="w-full h-8 text-xs">
                      <SelectValue placeholder="Change status..." />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(DocumentStatus).map((status) => (
                        <SelectItem
                          key={status}
                          value={status}
                          className="text-xs"
                        >
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Document Preview Area */}
        <div className="flex-1 relative bg-gradient-to-br from-muted/10 to-muted/30">
          {/* Toggle Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setIsDetailsSidebarCollapsed(!isDetailsSidebarCollapsed)
            }
            className="absolute top-4 left-4 z-10 bg-background/90 backdrop-blur-sm shadow-sm"
            title={isDetailsSidebarCollapsed ? "Show details" : "Hide details"}
          >
            {isDetailsSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>

          {/* Document Preview */}
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="bg-background/80 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-border">
                <FileText className="w-20 h-20 text-primary mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Document Viewer
                </h3>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {document.title}
                </p>
                <div className="text-xs text-muted-foreground space-y-1 mb-6">
                  <p>Category: {document.category}</p>
                  <p>Status: {document.status}</p>
                </div>
                <Button
                  variant="primary"
                  onClick={handleEditDocument}
                  className="mb-4 flex items-center gap-2 mx-auto"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Document
                </Button>
                <div className="p-3 bg-muted/50 rounded border text-xs text-muted-foreground">
                  PDF/Word viewer integration would be implemented here
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
