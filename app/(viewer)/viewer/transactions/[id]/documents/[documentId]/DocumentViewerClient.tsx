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

import { DocumentStatus, type Document } from "@/types/documents";
import { useDocumentViewer } from "@/hooks/use-document-viewer";
import { checkDocumentForEdit } from "@/lib/api/transaction-documents";
import { useToast } from "@/hooks/use-toast";
import { useTransactionCoordinatorAgentAuth } from "@/hooks/use-transaction-coordinator-agent-auth";

const getBadgeVariant = (
  status: DocumentStatus
): "default" | "success" | "warning" | "error" => {
  switch (status) {
    case DocumentStatus.PENDING:
      return "warning";
    case DocumentStatus.IN_EDITION:
      return "warning";
    case DocumentStatus.AWAITING_SIGNATURES:
      return "warning";
    case DocumentStatus.SIGNED:
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
  const { toast } = useToast();
  const { transactionCoordinatorAgentUser: agentUser } =
    useTransactionCoordinatorAgentAuth();
  const [isDetailsSidebarCollapsed, setIsDetailsSidebarCollapsed] =
    useState(false);
  const [isCheckingForEdit, setIsCheckingForEdit] = useState(false);

  // Use the custom hook to fetch document data
  const { document, loading, error, refetch } = useDocumentViewer(
    transactionId,
    documentId
  );

  // Check if user is an agent and can edit
  const isAgent = agentUser?.role === "real_estate_agent";
  const canEditDocument = document?.isEditable && isAgent;

  const handleCheckForEdit = async () => {
    if (!document) return;

    try {
      setIsCheckingForEdit(true);
      const updatedDocument = await checkDocumentForEdit(
        transactionId,
        documentId
      );

      // Preserve the original URL since check-for-edit doesn't return it
      const documentWithUrl = {
        ...updatedDocument,
        url: document.url,
      };

      // Reload the document information but preserve the URL
      await refetch();

      toast({
        title: "Document status updated",
        description: "The document information has been refreshed.",
        variant: "default",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to check document for edit";
      toast({
        title: "Error checking document",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsCheckingForEdit(false);
    }
  };

  const handleEditDocument = () => {
    // Guardar los datos del documento en sessionStorage para el editor
    if (document) {
      const sessionKey = `document_${transactionId}_${documentId}`;
      sessionStorage.setItem(sessionKey, JSON.stringify(document));
    }

    const editUrl = `/transaction-coordinator/transactions/${transactionId}/documents/${documentId}/edit`;

    router.push(editUrl);
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

                  <div>
                    <span className="text-xs text-muted-foreground">
                      Document Permissions
                    </span>
                    <div className="mt-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            document.isEditable ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></div>
                        <span className="text-xs text-foreground">
                          {document.isEditable ? "Editable" : "Read-only"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            document.isSignable ? "bg-green-500" : "bg-gray-400"
                          }`}
                        ></div>
                        <span className="text-xs text-foreground">
                          {document.isSignable
                            ? "Ready to sign"
                            : "Not ready for signature"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            document.couldBeRequestedForSignature
                              ? "bg-blue-500"
                              : "bg-gray-400"
                          }`}
                        ></div>
                        <span className="text-xs text-foreground">
                          {document.couldBeRequestedForSignature
                            ? "Can request signature"
                            : "Signature not available"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Actions
                </h4>
                <div className="space-y-2">
                  {document.status === DocumentStatus.PENDING && isAgent && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCheckForEdit}
                      disabled={isCheckingForEdit}
                      className="w-full flex items-center gap-2"
                    >
                      {isCheckingForEdit ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          Checking...
                        </>
                      ) : (
                        <>
                          <Edit3 className="w-4 h-4" />
                          Check For Edit
                        </>
                      )}
                    </Button>
                  )}

                  {canEditDocument &&
                    document.status !== DocumentStatus.PENDING && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleEditDocument}
                        className="w-full flex items-center gap-2"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit Document
                      </Button>
                    )}

                  {document.isSignable && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => console.log("Sign document")}
                      className="w-full flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <FileText className="w-4 h-4" />
                      Sign Document
                    </Button>
                  )}

                  {document.couldBeRequestedForSignature && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => console.log("Request signature")}
                      className="w-full flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Request Signature
                    </Button>
                  )}

                  {document.status === DocumentStatus.SIGNED && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => console.log("Download signed document")}
                      className="w-full flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Download
                    </Button>
                  )}

                  {document.status === DocumentStatus.REJECTED && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => console.log("View rejection reason")}
                      className="w-full flex items-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4" />
                      View Rejection
                    </Button>
                  )}
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
            className="absolute top-16 left-2 z-10 bg-white shadow-sm h-8 w-8 p-0"
            title={isDetailsSidebarCollapsed ? "Show details" : "Hide details"}
          >
            {isDetailsSidebarCollapsed ? (
              <ChevronRight className="w-3 h-3" />
            ) : (
              <ChevronLeft className="w-3 h-3" />
            )}
          </Button>

          {/* Document Preview */}
          <div className="h-full flex flex-col">
            {document.url ? (
              <div className="flex-1 bg-white">
                <iframe
                  src={document.url}
                  className="w-full h-full border-0"
                  title={`Document: ${document.title}`}
                  style={{ minHeight: "500px" }}
                />
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
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
                    {(canEditDocument ||
                      (document.status === DocumentStatus.PENDING &&
                        isAgent)) && (
                      <Button
                        variant="primary"
                        onClick={handleEditDocument}
                        className="mb-4 flex items-center gap-2 mx-auto"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit Document
                      </Button>
                    )}
                    <div className="p-3 bg-muted/50 rounded border text-xs text-muted-foreground">
                      Document URL not available for preview
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
