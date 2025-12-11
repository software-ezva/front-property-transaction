import DocumentsList from "@/components/organisms/DocumentsList";
import DocumentTemplateSelector from "@/components/organisms/DocumentTemplateSelector";
import { useTransactionDocuments } from "@/hooks/use-transaction-documents";

interface TransactionDocumentsTabProps {
  transactionId: string;
  readOnly?: boolean;
}

export default function TransactionDocumentsTab({
  transactionId,
  readOnly = false,
}: TransactionDocumentsTabProps) {
  const {
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
  } = useTransactionDocuments(transactionId);

  return (
    <>
      <DocumentsList
        documents={documents}
        loading={documentsLoading}
        error={documentsError}
        onAddDocuments={
          !readOnly ? () => setIsAddDocumentModalOpen(true) : undefined
        }
        onViewDocument={handleViewDocument}
        onArchiveDocument={!readOnly ? handleArchiveDocument : undefined}
        onRetry={fetchDocuments}
        readOnly={readOnly}
      />

      {!readOnly && (
        <DocumentTemplateSelector
          open={isAddDocumentModalOpen}
          onOpenChange={setIsAddDocumentModalOpen}
          templates={documentTemplates}
          selectedTemplates={selectedTemplates}
          onTemplateToggle={handleTemplateToggle}
          onAddSelected={handleAddSelectedDocuments}
          loading={addingDocuments}
          templatesLoading={templatesLoading}
          templatesError={templatesError}
          onRetryTemplates={fetchDocumentTemplates}
        />
      )}
    </>
  );
}
