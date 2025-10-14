import DocumentEditorClient from "./DocumentEditorClient";

interface DocumentEditorPageProps {
  params: Promise<{
    id: string;
    documentId: string;
  }>;
}

export default async function DocumentEditorPage({
  params,
}: DocumentEditorPageProps) {
  const { id, documentId } = await params;

  return <DocumentEditorClient transactionId={id} documentId={documentId} />;
}
