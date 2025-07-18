import type { Metadata } from "next"
import WorkflowTemplateDetailsClient from "./WorkflowTemplateDetailsClient"

export const metadata: Metadata = {
  title: "Workflow Template Details - PropManager Agent",
  description: "View workflow template details and structure.",
}

interface WorkflowTemplateDetailsPageProps {
  params: {
    id: string
  }
}

export default function WorkflowTemplateDetailsPage({ params }: WorkflowTemplateDetailsPageProps) {
  return <WorkflowTemplateDetailsClient templateId={params.id} />
}
