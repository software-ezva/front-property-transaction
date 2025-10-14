"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  AlertCircle,
  Save,
  Edit3,
} from "lucide-react";
import Button from "@/components/atoms/Button";
import CustomBadge from "@/components/atoms/Badge";
import PageTitle from "@/components/molecules/PageTitle";
import DocumentSaveDialog from "@/components/molecules/DocumentSaveDialog";
import PDFEditor from "@/components/molecules/PDFEditor";
import { DocumentStatus, type Document } from "@/types/documents";

import { updateDocumentFile } from "@/lib/api/transaction-documents";
import { useToast } from "@/hooks/use-toast";

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

interface DocumentEditorClientProps {
  transactionId: string;
  documentId: string;
}

export default function DocumentEditorClient({
  transactionId,
  documentId,
}: DocumentEditorClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isDetailsSidebarCollapsed, setIsDetailsSidebarCollapsed] =
    useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [editedTitle, setEditedTitle] = useState("");

  const [isReadyToSign, setIsReadyToSign] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Estado local para el documento
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para limpiar sessionStorage
  const clearDocumentCache = useCallback(() => {
    const sessionKey = `document_${transactionId}_${documentId}`;
    sessionStorage.removeItem(sessionKey);
  }, [transactionId, documentId]);

  // Función para obtener documento desde sessionStorage o API
  const loadDocument = useCallback(async () => {
    // Si ya tenemos el documento, no cargar de nuevo
    if (document) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Primero intentar obtener desde sessionStorage
      const sessionKey = `document_${transactionId}_${documentId}`;
      const cachedData = sessionStorage.getItem(sessionKey);

      if (cachedData) {
        const parsedDocument = JSON.parse(cachedData);
        // Convertir fechas desde strings
        parsedDocument.createdAt = new Date(parsedDocument.createdAt);
        parsedDocument.updatedAt = new Date(parsedDocument.updatedAt);
        setDocument(parsedDocument);
        setLoading(false);

        return;
      }

      // No hay datos en cache - mostrar error en lugar de llamar API
      throw new Error(
        "Document data not found. Please navigate to the editor from the document viewer."
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load document";
      setError(errorMessage);
      toast({
        title: "Error loading document",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [transactionId, documentId, toast, document]);

  // Función refetch para compatibilidad
  const refetch = useCallback(() => {
    // Intentar recargar (principalmente para sessionStorage)
    loadDocument();
  }, [loadDocument]);

  // Initialize editing state when document loads
  const initializeEditing = useCallback(() => {
    if (document && isEditing) {
      setEditedTitle(document.title);
    }
  }, [document, isEditing]);

  // Cargar documento al montar el componente
  useEffect(() => {
    if (transactionId && documentId) {
      loadDocument();
    }
  }, [transactionId, documentId, loadDocument]);

  // Auto-initialize when document loads
  useEffect(() => {
    initializeEditing();
  }, [initializeEditing]);

  // Limpiar sessionStorage cuando se cierra la pestaña
  useEffect(() => {
    const handleBeforeUnload = () => {
      clearDocumentCache();
    };

    // Agregar listener para cuando se cierra la pestaña
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup: solo remover el listener, NO limpiar el cache automáticamente
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [clearDocumentCache]);

  const handleCancelEdit = () => {
    if (window.confirm("Discard unsaved changes?")) {
      // Limpiar cache al cancelar
      clearDocumentCache();

      router.push(
        `/viewer/transactions/${transactionId}/documents/${documentId}`
      );
    }
  };

  const handleSaveChanges = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmSave = async (readyToSign: boolean) => {
    setIsSaving(true);
    try {
      await updateDocumentFile(
        transactionId,
        documentId,
        editedTitle,
        readyToSign
      );

      setShowConfirmDialog(false);
      setIsReadyToSign(false);

      toast({
        title: "Document updated successfully",
        description: readyToSign
          ? "Document marked as ready to sign"
          : "Document status updated",
        variant: "default",
      });

      // Limpiar cache al guardar cambios
      clearDocumentCache();

      router.push(
        `/viewer/transactions/${transactionId}/documents/${documentId}`
      );
    } catch (error) {
      toast({
        title: "Error updating document",
        description:
          error instanceof Error ? error.message : "Failed to update document",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    const hasUnsavedChanges = editedTitle !== document?.title;
    if (hasUnsavedChanges && !window.confirm("Discard unsaved changes?")) {
      return;
    }

    // Limpiar cache al cerrar
    clearDocumentCache();

    router.push(
      `/viewer/transactions/${transactionId}/documents/${documentId}`
    );
  };

  // Manejar guardado del PDF Editor
  const handlePDFEditorSave = (success: boolean) => {
    if (success) {
      toast({
        title: "Document saved",
        description: "Document has been saved with annotations",
        variant: "default",
      });

      // Limpiar cache al guardar PDF
      clearDocumentCache();

      router.push(
        `/viewer/transactions/${transactionId}/documents/${documentId}`
      );
    }
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
            Document Editor Access Error
          </h3>
          <p className="text-muted-foreground mb-4">
            {error ||
              "Please navigate to the document editor from the document viewer to ensure proper data loading."}
          </p>
          <div className="space-x-2">
            <Button
              variant="primary"
              onClick={() =>
                router.push(
                  `/viewer/transactions/${transactionId}/documents/${documentId}`
                )
              }
            >
              Go to Document Viewer
            </Button>
            <Button variant="outline" onClick={refetch}>
              Try Again
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
              </div>
            </div>
          </div>

          {/* Document Editor Area */}
          <div className="flex-1 relative bg-gradient-to-br from-muted/10 to-muted/30">
            {/* Toggle Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setIsDetailsSidebarCollapsed(!isDetailsSidebarCollapsed)
              }
              className="absolute top-16 left-2 z-10 bg-white shadow-sm h-8 w-8 p-0"
              title={
                isDetailsSidebarCollapsed ? "Show details" : "Hide details"
              }
            >
              {isDetailsSidebarCollapsed ? (
                <ChevronRight className="w-3 h-3" />
              ) : (
                <ChevronLeft className="w-3 h-3" />
              )}
            </Button>

            {/* PDF Editor */}
            <div className="h-full flex flex-col p-4">
              {document.url ? (
                <PDFEditor
                  documentUrl={document.url}
                  documentTitle={editedTitle || document.title}
                  onSave={handlePDFEditorSave}
                  onCancel={() =>
                    router.push(
                      `/viewer/transactions/${transactionId}/documents/${documentId}`
                    )
                  }
                  className="flex-1"
                />
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center max-w-2xl">
                    <div className="bg-background/80 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-border">
                      <FileText className="w-20 h-20 text-primary mx-auto mb-6" />
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        Document Editor
                      </h3>
                      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                        {editedTitle}
                      </p>
                      <div className="text-xs text-muted-foreground space-y-1 mb-6">
                        <p>Category: {document.category}</p>
                      </div>
                      <div className="mt-6 p-3 bg-muted/50 rounded border text-xs text-muted-foreground">
                        Document URL not available for editing
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
        isReadyForReview={false}
        isLoading={isSaving}
      />
    </>
  );
}
