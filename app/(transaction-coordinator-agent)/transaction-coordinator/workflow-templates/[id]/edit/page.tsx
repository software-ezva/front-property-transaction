import EditWorkflowTemplateClient from "./EditWorkflowTemplateClient";

export default async function EditWorkflowTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditWorkflowTemplateClient templateId={id} />;
}
