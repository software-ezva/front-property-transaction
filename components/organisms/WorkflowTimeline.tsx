import { useState } from "react";
import { Plus } from "lucide-react";
import Button from "@/components/atoms/Button";
import InlineAddForm from "@/components/molecules/InlineAddForm";
import { Workflow, Item } from "@/types/workflow";
import WorkflowChecklist from "./WorkflowChecklist";

interface WorkflowTimelineProps {
  workflow: Workflow;
  onUpdateItem?: (
    checklistId: string,
    itemId: string,
    updates: Partial<Item>
  ) => void;
  onAddChecklist?: (name: string) => Promise<void>;
  onAddItem?: (checklistId: string, description: string) => Promise<void>;
  onAddUpdate?: (itemId: string, content: string) => Promise<void>;
  readOnly?: boolean;
}

export default function WorkflowTimeline({
  workflow,
  onUpdateItem,
  onAddChecklist,
  onAddItem,
  onAddUpdate,
  readOnly = false,
}: WorkflowTimelineProps) {
  const [isAddingChecklist, setIsAddingChecklist] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Workflow Timeline
        </h3>
        {onAddChecklist && !readOnly && (
          <div className="flex justify-end mb-4">
            {isAddingChecklist ? (
              <InlineAddForm
                placeholder="Checklist name..."
                onAdd={onAddChecklist}
                onCancel={() => setIsAddingChecklist(false)}
              />
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddingChecklist(true)}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Checklist
              </Button>
            )}
          </div>
        )}
      </div>

      {workflow.checklists
        .sort((a, b) => a.order - b.order)
        .map((checklist, checklistIndex) => (
          <WorkflowChecklist
            key={checklist.id}
            checklist={checklist}
            hasNext={checklistIndex < workflow.checklists.length - 1}
            onUpdateItem={onUpdateItem}
            onAddItem={onAddItem}
            onAddUpdate={onAddUpdate}
            readOnly={readOnly}
          />
        ))}
    </div>
  );
}
