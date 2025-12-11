import type { Metadata } from "next";
import WorkflowTemplateDetailsClient from "./WorkflowTemplateDetailsClient";

export const metadata: Metadata = {
  title: "Workflow Template Details - PropManager Agent",
  description: "View workflow template details and structure.",
};

interface WorkflowTemplateDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function WorkflowTemplateDetailsPage({
  params,
}: WorkflowTemplateDetailsPageProps) {
  // Await params if required by Next.js dynamic routes
  const awaitedParams = await params;
  return <WorkflowTemplateDetailsClient templateId={awaitedParams.id} />;
}
