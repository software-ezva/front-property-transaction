import { useState, useEffect } from "react";
import { Document } from "@/types/documents";
import { getTransactionDocument } from "@/lib/api/transaction-documents";
import { useToast } from "@/hooks/use-toast";

export function useDocumentViewer(transactionId: string, documentId: string) {
  const { toast } = useToast();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocument = async () => {
    try {
      setLoading(true);
      setError(null);
      const documentData = await getTransactionDocument(
        transactionId,
        documentId
      );
      setDocument(documentData);
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
  };

  useEffect(() => {
    if (transactionId && documentId) {
      fetchDocument();
    }
  }, [transactionId, documentId]);

  return {
    document,
    loading,
    error,
    refetch: fetchDocument,
  };
}
