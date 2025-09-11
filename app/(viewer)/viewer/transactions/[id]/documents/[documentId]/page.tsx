import DocumentViewerClient from "./DocumentViewerClient";

export default async function DocumentViewerPage({
  params,
}: {
  params: Promise<{ id: string; documentId: string }>;
}) {
  const { id, documentId } = await params;

  return <DocumentViewerClient transactionId={id} documentId={documentId} />;
}
