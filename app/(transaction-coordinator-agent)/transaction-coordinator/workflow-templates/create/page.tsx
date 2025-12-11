import type { Metadata } from "next"
import CreateWorkflowTemplateClient from "./CreateWorkflowTemplateClient"

export const metadata: Metadata = {
  title: "Create Workflow Template - PropManager Agent",
  description: "Create a new workflow template for transactions.",
}

export default function CreateWorkflowTemplatePage() {
  return <CreateWorkflowTemplateClient />
}
