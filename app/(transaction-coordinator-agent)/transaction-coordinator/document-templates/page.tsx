import type { Metadata } from "next"
import DocumentTemplatesClient from "./DocumentTemplatesClient"

export const metadata: Metadata = {
  title: "Document Templates - PropManager",
  description: "Manage document templates for real estate transactions",
}

export default function DocumentTemplatesPage() {
  return <DocumentTemplatesClient />
}
