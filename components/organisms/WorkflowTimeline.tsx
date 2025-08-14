import { useState } from "react";
import { CheckCircle, PlayCircle, Circle } from "lucide-react";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ChecklistHeader from "@/components/molecules/ChecklistHeader";
import ChecklistItem from "@/components/molecules/ChecklistItem";
import { Workflow, Checklist, Item, ItemStatus } from "@/types/workflow";

interface WorkflowTimelineProps {
  workflow: Workflow;
  onUpdateItem?: (itemId: string, updates: Partial<Item>) => void;
}

export default function WorkflowTimeline({
  workflow,
  onUpdateItem,
}: WorkflowTimelineProps) {
  const [expandedChecklists, setExpandedChecklists] = useState<string[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Helper functions
  const getChecklistStatus = (checklist: Checklist): ItemStatus => {
    const completedItems = checklist.items.filter(
      (item) => item.status === ItemStatus.COMPLETED
    ).length;
    const totalItems = checklist.items.length;

    if (completedItems === totalItems) return ItemStatus.COMPLETED;
    if (completedItems > 0) return ItemStatus.IN_PROGRESS;
    return ItemStatus.NOT_STARTED;
  };

  const getStatusIcon = (status: ItemStatus) => {
    switch (status) {
      case ItemStatus.COMPLETED:
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case ItemStatus.IN_PROGRESS:
        return <PlayCircle className="w-6 h-6 text-blue-500" />;
      default:
        return <Circle className="w-6 h-6 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: ItemStatus) => {
    return (
      <Badge
        variant={
          status === ItemStatus.COMPLETED
            ? "success"
            : status === ItemStatus.IN_PROGRESS
            ? "default"
            : "warning"
        }
        className="text-xs"
      >
        {status.replace("_", " ").toUpperCase()}
      </Badge>
    );
  };

  const toggleChecklistExpansion = (checklistId: string) => {
    setExpandedChecklists((prev) =>
      prev.includes(checklistId)
        ? prev.filter((id) => id !== checklistId)
        : [...prev, checklistId]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Edit handlers
  const handleEditItem = (itemId: string) => {
    setEditingItemId(itemId);
  };

  const handleSaveItem = (itemId: string, updates: Partial<Item>) => {
    onUpdateItem?.(itemId, updates);
    setEditingItemId(null);
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
  };

  return (
    <div className="space-y-4">
      {workflow.checklists
        .sort((a, b) => a.order - b.order)
        .map((checklist, checklistIndex) => {
          const checklistStatus = getChecklistStatus(checklist);
          const isExpanded = expandedChecklists.includes(checklist.id);
          const completedInChecklist = checklist.items.filter(
            (item) => item.status === ItemStatus.COMPLETED
          ).length;
          const checklistProgress = Math.round(
            (completedInChecklist / checklist.items.length) * 100
          );

          return (
            <div key={checklist.id} className="relative">
              {/* Vertical line connecting checklists */}
              {checklistIndex < workflow.checklists.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-12 bg-border" />
              )}

              {/* Checklist Header */}
              <ChecklistHeader
                checklist={checklist}
                isExpanded={isExpanded}
                completedCount={completedInChecklist}
                totalCount={checklist.items.length}
                progress={checklistProgress}
                checklistStatus={checklistStatus}
                onToggle={toggleChecklistExpansion}
                getStatusIcon={getStatusIcon}
                getStatusBadge={getStatusBadge}
              />

              {/* Checklist Items */}
              {isExpanded && (
                <div className="ml-8 mt-2 space-y-0.5">
                  {checklist.items
                    .sort((a, b) => a.order - b.order)
                    .map((item) => (
                      <ChecklistItem
                        key={item.id}
                        item={item}
                        isEditing={editingItemId === item.id}
                        onEdit={handleEditItem}
                        onSave={handleSaveItem}
                        onCancelEdit={handleCancelEdit}
                        getStatusIcon={getStatusIcon}
                        getStatusBadge={getStatusBadge}
                        formatDate={formatDate}
                      />
                    ))}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}
