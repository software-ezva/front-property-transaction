import { useState } from "react";
import { CheckCircle, PlayCircle, Circle, Plus } from "lucide-react";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ChecklistHeader from "@/components/molecules/ChecklistHeader";
import ChecklistItem from "@/components/molecules/ChecklistItem";
import InlineAddForm from "@/components/molecules/InlineAddForm";
import { Checklist, Item, ItemStatus } from "@/types/workflow";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";

interface WorkflowChecklistProps {
  checklist: Checklist;
  hasNext: boolean;
  onUpdateItem?: (
    checklistId: string,
    itemId: string,
    updates: Partial<Item>
  ) => void;
  onAddItem?: (checklistId: string, description: string) => Promise<void>;
  onAddUpdate?: (itemId: string, content: string) => Promise<void>;
  readOnly?: boolean;
}

export default function WorkflowChecklist({
  checklist,
  hasNext,
  onUpdateItem,
  onAddItem,
  onAddUpdate,
  readOnly = false,
}: WorkflowChecklistProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);

  const items = checklist.items || [];

  // Helper functions
  const getChecklistStatus = (checklist: Checklist): ItemStatus => {
    const items = checklist.items || [];
    const completedItems = items.filter(
      (item) => item.status === ItemStatus.COMPLETED
    ).length;
    const totalItems = items.length;

    if (totalItems === 0) return ItemStatus.NOT_STARTED;
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
    onUpdateItem?.(checklist.id, itemId, updates);
    setEditingItemId(null);
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
  };

  const completedInChecklist = items.filter(
    (item) => item.status === ItemStatus.COMPLETED
  ).length;

  const checklistProgress =
    items.length > 0
      ? Math.round((completedInChecklist / items.length) * 100)
      : 0;

  const checklistStatus = getChecklistStatus(checklist);

  return (
    <Collapsible
      open={isExpanded}
      onOpenChange={setIsExpanded}
      className="relative"
    >
      {/* Vertical line connecting checklists */}
      {hasNext && (
        <div className="absolute left-5 top-14 -bottom-4 w-0.5 bg-border" />
      )}

      {/* Checklist Header */}
      <ChecklistHeader
        checklist={checklist}
        isExpanded={isExpanded}
        completedCount={completedInChecklist}
        totalCount={items.length}
        progress={checklistProgress}
        checklistStatus={checklistStatus}
        onToggle={() => setIsExpanded(!isExpanded)}
        getStatusIcon={getStatusIcon}
        getStatusBadge={getStatusBadge}
      />

      {/* Checklist Items */}
      <CollapsibleContent className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
        <div className="ml-8 mt-2 space-y-0.5">
          {items
            .sort((a, b) => a.order - b.order)
            .map((item) => (
              <ChecklistItem
                key={item.id}
                item={item}
                isEditing={editingItemId === item.id}
                onEdit={onUpdateItem && !readOnly ? handleEditItem : undefined}
                onSave={onUpdateItem && !readOnly ? handleSaveItem : undefined}
                onCancelEdit={
                  onUpdateItem && !readOnly ? handleCancelEdit : undefined
                }
                onAddUpdate={onAddUpdate}
                getStatusIcon={getStatusIcon}
                getStatusBadge={getStatusBadge}
                formatDate={formatDate}
                readOnly={readOnly}
              />
            ))}

          {/* Add Item Section */}
          {onAddItem && !readOnly && (
            <div className="pt-2 pl-2">
              {isAddingItem ? (
                <InlineAddForm
                  placeholder="Task description..."
                  onAdd={async (desc) => {
                    await onAddItem(checklist.id, desc);
                    setIsAddingItem(false);
                  }}
                  onCancel={() => setIsAddingItem(false)}
                />
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddingItem(true)}
                  className="text-muted-foreground hover:text-foreground gap-2 h-8"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Task
                </Button>
              )}
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
