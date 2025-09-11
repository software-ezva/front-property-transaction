import DocumentEditorClient from "./DocumentEditorClient";

interface DocumentEditorPageProps {
  params: {
    id: string;
    documentId: string;
  };
}

export default function DocumentEditorPage({
  params,
}: DocumentEditorPageProps) {
  return (
    <DocumentEditorClient
      transactionId={params.id}
      documentId={params.documentId}
    />
  );
}
