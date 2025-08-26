import DocumentViewerClient from "./DocumentViewerClient"

export default function DocumentViewerPage({
  params,
}: {
  params: { id: string; documentId: string }
}) {
  return <DocumentViewerClient transactionId={params.id} documentId={params.documentId} />
}
