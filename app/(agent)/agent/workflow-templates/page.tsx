import type { Metadata } from "next"
import WorkflowTemplatesClient from "./WorkflowTemplatesClient"

export const metadata: Metadata = {
  title: "Workflow Templates - PropManager Agent",
  description: "Manage workflow templates for different transaction types.",
}

export default function WorkflowTemplatesPage() {
  return <WorkflowTemplatesClient />
}
