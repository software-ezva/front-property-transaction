import { useState, useEffect } from "react";
import { Document, DocumentStatus, DocumentCategory } from "@/types/documents";
import { DocumentTemplate } from "@/types/document-templates";
import { useToast } from "@/hooks/use-toast";
import { ENDPOINTS } from "@/lib/constants";
import { apiClient } from "@/lib/api-internal";
import {
  getTransactionDocuments,
  createDocumentFromTemplate,
  getTransactionDocument,
} from "@/lib/api/transaction-documents";
import { getTemplates } from "@/lib/api/document-templates";

const mockDocuments: Document[] = [
  {
    documentId: "doc_001",
    title: "Purchase Agreement",
    category: DocumentCategory.CONTRACT_AND_NEGOTIATION,
    url: "/documents/purchase-agreement.pdf",
    createdAt: new Date("2024-01-15T10:00:00Z"),
    updatedAt: new Date("2024-01-20T14:30:00Z"),
    status: DocumentStatus.SIGNED,
  },
  {
    documentId: "doc_002",
    title: "Property Disclosure Statement",
    category: DocumentCategory.DISCLOSURE,
    url: "/documents/property-disclosure.pdf",
    createdAt: new Date("2024-01-16T09:00:00Z"),
    updatedAt: new Date("2024-01-18T11:00:00Z"),
    status: DocumentStatus.READY,
  },
  {
    documentId: "doc_003",
    title: "Home Inspection Report",
    category: DocumentCategory.MISCELLANEOUS,
    url: "/documents/inspection-report.pdf",
    createdAt: new Date("2024-01-20T15:00:00Z"),
    updatedAt: new Date("2024-01-22T10:00:00Z"),
    status: DocumentStatus.PENDING,
  },
  {
    documentId: "doc_004",
    title: "Title Insurance Policy",
    category: DocumentCategory.TITLE_AND_OWNERSHIP,
    url: "/documents/title-insurance.pdf",
    createdAt: new Date("2024-01-18T12:00:00Z"),
    updatedAt: new Date("2024-01-19T16:00:00Z"),
    status: DocumentStatus.WAITING,
  },
  {
    documentId: "doc_005",
    title: "Closing Disclosure",
    category: DocumentCategory.CLOSING_AND_FINANCING,
    url: "/documents/closing-disclosure.pdf",
    createdAt: new Date("2024-01-22T08:00:00Z"),
    updatedAt: new Date("2024-01-22T08:00:00Z"),
    status: DocumentStatus.PENDING,
  },
];

export function useTransactionDocuments(transactionId: string) {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [documentsError, setDocumentsError] = useState<string | null>(null);
  const [isAddDocumentModalOpen, setIsAddDocumentModalOpen] = useState(false);
  const [selectedTemplates, setSelectedTemplates] = useState<Set<string>>(
    new Set()
  );
  const [addingDocuments, setAddingDocuments] = useState(false);

  // Document templates state
  const [documentTemplates, setDocumentTemplates] = useState<
    DocumentTemplate[]
  >([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [templatesError, setTemplatesError] = useState<string | null>(null);

  // Fetch documents from API
  const fetchDocuments = async () => {
    try {
      setDocumentsLoading(true);
      setDocumentsError(null);
      const data = await getTransactionDocuments(transactionId);
      setDocuments(data);
    } catch (err) {
      setDocumentsError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setDocumentsLoading(false);
    }
  };

  // Fetch document templates from API
  const fetchDocumentTemplates = async () => {
    try {
      setTemplatesLoading(true);
      setTemplatesError(null);
      const data = await getTemplates();
      setDocumentTemplates(data);
    } catch (err) {
      setTemplatesError(
        err instanceof Error ? err.message : "Error loading templates"
      );
    } finally {
      setTemplatesLoading(false);
    }
  };

  // Initialize documents when component mounts
  useEffect(() => {
    if (transactionId) {
      fetchDocuments();
    }
  }, [transactionId]);

  // Load templates when modal opens
  useEffect(() => {
    if (isAddDocumentModalOpen && documentTemplates.length === 0) {
      fetchDocumentTemplates();
    }
  }, [isAddDocumentModalOpen]);

  const handleTemplateToggle = (templateId: string) => {
    const newSelected = new Set(selectedTemplates);
    if (newSelected.has(templateId)) {
      newSelected.delete(templateId);
    } else {
      newSelected.add(templateId);
    }
    setSelectedTemplates(newSelected);
  };

  const handleAddSelectedDocuments = async () => {
    try {
      setAddingDocuments(true);

      const selectedTemplatesList = Array.from(selectedTemplates);

      if (selectedTemplatesList.length === 0) {
        toast({
          title: "No templates selected",
          description: "Please select at least one template to add documents",
          variant: "destructive",
        });
        return;
      }

      // Create documents from templates using real API calls
      const createDocumentPromises = selectedTemplatesList.map((templateId) => {
        return createDocumentFromTemplate(transactionId, templateId);
      });

      const newDocuments = await Promise.all(createDocumentPromises);

      // Update local state with new documents
      setDocuments((prev) => [...prev, ...newDocuments]);

      toast({
        title: "Documents added",
        description: `Added ${newDocuments.length} document(s) from templates`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error adding documents:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to add documents",
        variant: "destructive",
      });
    } finally {
      setAddingDocuments(false);
      setIsAddDocumentModalOpen(false);
      setSelectedTemplates(new Set());
    }
  };

  const handleViewDocument = async (document: Document) => {
    try {
      // Fetch the latest document details from API to get the secure URL
      const documentDetails = await getTransactionDocument(
        transactionId,
        document.documentId
      );

      // Navigate to the viewer route with the document details
      const viewerUrl = `/viewer/transactions/${transactionId}/documents/${document.documentId}`;
      window.open(viewerUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error fetching document details:", error);
      toast({
        title: "Error",
        description: "Failed to load document details",
        variant: "destructive",
      });
    }
  };

  const handleArchiveDocument = (document: Document) => {
    // TODO: Implement document archiving with confirmation
    const confirmArchive = window.confirm(
      `Are you sure you want to archive "${document.title}"?`
    );
    if (confirmArchive) {
      setDocuments((prev) =>
        prev.filter((doc) => doc.documentId !== document.documentId)
      );
      toast({
        title: "Document archived",
        description: `"${document.title}" has been archived`,
        variant: "default",
      });
    }
  };

  return {
    documents,
    documentsLoading,
    documentsError,
    isAddDocumentModalOpen,
    setIsAddDocumentModalOpen,
    selectedTemplates,
    addingDocuments,
    documentTemplates,
    templatesLoading,
    templatesError,
    fetchDocuments,
    fetchDocumentTemplates,
    handleTemplateToggle,
    handleAddSelectedDocuments,
    handleViewDocument,
    handleArchiveDocument,
  };
}
