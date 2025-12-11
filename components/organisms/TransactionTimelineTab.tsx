import { CheckCircle } from "lucide-react";
import Button from "@/components/atoms/Button";
import WorkflowTimeline from "@/components/organisms/WorkflowTimeline";
import LoadingState from "@/components/molecules/LoadingState";
import { Workflow, Item, ItemStatus } from "@/types/workflow";

interface TransactionTimelineTabProps {
  workflow: Workflow | null;
  loading: boolean;
  error: string | null;
  fetchWorkflow: () => void;
  readOnly?: boolean;
  onUpdateItem?: (
    checklistId: string,
    itemId: string,
    updates: Partial<Item>
  ) => Promise<void>;
  onAddChecklist?: (title: string) => Promise<void>;
  onAddItem?: (
    checklistId: string,
    content: string,
    dueDate?: Date
  ) => Promise<void>;
  onAddUpdate?: (itemId: string, content: string) => Promise<void>;
  completedItems?: number;
  totalItems?: number;
  nextDue?: string | null;
}

export default function TransactionTimelineTab({
  workflow,
  loading,
  error,
  fetchWorkflow,
  readOnly = false,
  onUpdateItem,
  onAddChecklist,
  onAddItem,
  onAddUpdate,
  completedItems = 0,
  totalItems = 0,
  nextDue,
}: TransactionTimelineTabProps) {
  if (loading) {
    return <LoadingState title="Loading workflow..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Error Loading Timeline
        </h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button variant="outline" onClick={fetchWorkflow}>
          Retry
        </Button>
      </div>
    );
  }

  if (workflow && workflow.checklists) {
    return (
      <WorkflowTimeline
        workflow={workflow}
        onUpdateItem={!readOnly ? onUpdateItem : undefined}
        onAddChecklist={!readOnly ? onAddChecklist : undefined}
        onAddItem={!readOnly ? onAddItem : undefined}
        onAddUpdate={!readOnly ? onAddUpdate : undefined}
        readOnly={readOnly}
      />
    );
  }

  return (
    <div className="text-center py-12">
      <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Timeline Coming Soon
      </h3>
      <p className="text-muted-foreground mb-4">
        Workflow timeline will be loaded from a separate endpoint for better
        performance
      </p>
      <div className="text-sm text-muted-foreground">
        <p>
          Progress: {completedItems} of {totalItems} items completed
        </p>
        {nextDue && (
          <p>Next task due: {new Date(nextDue).toLocaleDateString()}</p>
        )}
      </div>
    </div>
  );
}
