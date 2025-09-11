"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  AlertCircle,
  Save,
  Edit3,
  Check,
} from "lucide-react";
import Button from "@/components/atoms/Button";
import CustomBadge from "@/components/atoms/Badge";
import PageTitle from "@/components/molecules/PageTitle";
import DocumentSaveDialog from "@/components/molecules/DocumentSaveDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
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

interface DocumentEditorClientProps {
  transactionId: string;
  documentId: string;
}

export default function DocumentEditorClient({
  transactionId,
  documentId,
}: DocumentEditorClientProps) {
  const router = useRouter();
  const [isDetailsSidebarCollapsed, setIsDetailsSidebarCollapsed] =
    useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const [newStatus, setNewStatus] = useState<DocumentStatus | null>(null);
  const [isReadyForReview, setIsReadyForReview] = useState(false);
  const [isReadyToSign, setIsReadyToSign] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Use the custom hook to fetch document data
  const { document, loading, error, refetch } = useDocumentViewer(
    transactionId,
    documentId
  );

  // Initialize editing state when document loads
  const handleStartEditing = useCallback(() => {
    if (document) {
      setEditedTitle(document.title);
      setEditedContent(""); // Initialize with empty content for notes
      setNewStatus(document.status);
      setIsEditing(true);
    }
  }, [document]);

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTitle("");
    setEditedContent("");
    setNewStatus(null);
    setIsReadyForReview(false);
    setIsReadyToSign(false);
  };

  const handleSaveChanges = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmSave = async (readyToSign: boolean) => {
    setIsSaving(true);
    try {
      // Here you would make the API call to save the document
      // For now, we'll simulate the API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Saving document with:", {
        title: editedTitle,
        content: editedContent,
        status: newStatus,
        isReadyForReview,
        isReadyToSign: readyToSign,
      });

      // Close edit mode and dialog
      setIsEditing(false);
      setShowConfirmDialog(false);
      setIsReadyForReview(false);
      setIsReadyToSign(false);

      // Refetch document data
      refetch();

      // Show success message (you can add a toast here)
      console.log(
        "Document saved successfully!",
        readyToSign ? "Ready to sign!" : ""
      );
    } catch (error) {
      console.error("Error saving document:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = (status: string) => {
    setNewStatus(status as DocumentStatus);
  };

  const handleClose = () => {
    if (isEditing) {
      // Show warning about unsaved changes
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (!confirmLeave) return;
    }

    // Navigate back to transaction view
    router.push(`/agent/transactions/${transactionId}`);
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
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-screen flex flex-col bg-background">
        {/* Header */}
        <div className="border-b border-border bg-background px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-8 h-8 text-primary" />
                <PageTitle
                  title={isEditing ? "Editing Document" : "Document Editor"}
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {isEditing ? (
                <>
                  <CustomBadge variant="warning">Editing</CustomBadge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <CustomBadge variant={getBadgeVariant(document.status)}>
                    {document.status}
                  </CustomBadge>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleStartEditing}
                    className="flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Document
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="text-muted-foreground hover:text-foreground"
                disabled={isSaving}
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
              isDetailsSidebarCollapsed ? "w-0" : "w-80"
            } transition-all duration-300 overflow-hidden border-r border-border bg-muted/20`}
          >
            <div className="p-4 h-full overflow-y-auto">
              <div className="space-y-6">
                {/* Document Details */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">
                    Document Details
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-muted-foreground">
                        Title
                      </span>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedTitle}
                          onChange={(e) => setEditedTitle(e.target.value)}
                          className="w-full mt-1 px-2 py-1 text-sm border border-border rounded bg-background"
                        />
                      ) : (
                        <p className="text-sm text-foreground mt-1 font-medium">
                          {document.title}
                        </p>
                      )}
                    </div>

                    <div>
                      <span className="text-xs text-muted-foreground">
                        Status
                      </span>
                      {isEditing ? (
                        <div className="mt-1">
                          <Select
                            defaultValue={document.status}
                            onValueChange={handleStatusChange}
                          >
                            <SelectTrigger className="w-full h-8 text-xs">
                              <SelectValue placeholder="Select status..." />
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
                      ) : (
                        <div className="mt-1">
                          <CustomBadge
                            variant={getBadgeVariant(document.status)}
                          >
                            {document.status}
                          </CustomBadge>
                        </div>
                      )}
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

                {/* Content Editor */}
                {isEditing && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">
                      Content Notes
                    </h4>
                    <Textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      placeholder="Add notes or content for this document..."
                      className="min-h-[120px] text-sm"
                    />
                  </div>
                )}

                {/* Ready for Review Checkbox */}
                {isEditing && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">
                      Review Status
                    </h4>
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="ready-for-review"
                        checked={isReadyForReview}
                        onCheckedChange={(checked) =>
                          setIsReadyForReview(!!checked)
                        }
                      />
                      <label
                        htmlFor="ready-for-review"
                        className="text-sm text-foreground leading-tight cursor-pointer"
                      >
                        Mark this document as ready for review
                      </label>
                    </div>
                    {isReadyForReview && (
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
                        <Check className="w-3 h-3 inline mr-1" />
                        This document will be marked as ready for client review.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Document Editor/Preview Area */}
          <div className="flex-1 relative bg-gradient-to-br from-muted/10 to-muted/30">
            {/* Toggle Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setIsDetailsSidebarCollapsed(!isDetailsSidebarCollapsed)
              }
              className="absolute top-4 left-4 z-10 bg-background/90 backdrop-blur-sm shadow-sm"
              title={
                isDetailsSidebarCollapsed ? "Show details" : "Hide details"
              }
            >
              {isDetailsSidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>

            {/* Document Preview */}
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-2xl">
                <div className="bg-background/80 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-border">
                  <FileText className="w-20 h-20 text-primary mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {isEditing ? "Document Editor" : "Document Preview"}
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {isEditing ? editedTitle : document.title}
                  </p>
                  <div className="text-xs text-muted-foreground space-y-1 mb-6">
                    <p>Category: {document.category}</p>
                    <p>
                      Status:{" "}
                      {isEditing && newStatus ? newStatus : document.status}
                    </p>
                    {isEditing && isReadyForReview && (
                      <p className="text-green-600 font-medium">
                        Ready for Review
                      </p>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                      <Edit3 className="w-4 h-4 inline mr-2" />
                      Document editing interface would be integrated here
                      <div className="mt-2 text-xs">
                        PDF Editor, Word Editor, or Rich Text Editor components
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 p-3 bg-muted/50 rounded border text-xs text-muted-foreground">
                      PDF/Word viewer integration would be implemented here
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Document Save Dialog */}
      <DocumentSaveDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmSave}
        title="Save Document Changes"
        documentTitle={editedTitle}
        isReadyForReview={isReadyForReview}
        isLoading={isSaving}
      />
    </>
  );
}
