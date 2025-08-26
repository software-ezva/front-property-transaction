import type { Metadata } from "next"
import CreateDocumentTemplateClient from "./CreateDocumentTemplateClient"

export const metadata: Metadata = {
  title: "Create Document Template - PropManager",
  description: "Create a new document template for real estate transactions",
}

export default function CreateDocumentTemplatePage() {
  return <CreateDocumentTemplateClient />
}
