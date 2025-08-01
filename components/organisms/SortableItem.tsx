import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import type { ChecklistItem } from "@/types/workflow-templates";

export interface SortableItemProps {
  id: string;
  checklistId: string;
  item: ChecklistItem;
  itemIndex: number;
  updateItem: (
    checklistId: string,
    itemId: string,
    description: string
  ) => void;
  removeItem: (checklistId: string, itemId: string) => void;
}

export function SortableItem({
  id,
  checklistId,
  item,
  itemIndex,
  updateItem,
  removeItem,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    background: isDragging ? "#f3f4f6" : undefined,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg"
    >
      <GripVertical
        className="w-4 h-4 text-muted-foreground cursor-move"
        {...attributes}
        {...listeners}
      />
      <span className="text-sm font-medium text-muted-foreground min-w-[40px]">
        {itemIndex + 1}.
      </span>
      <div className="flex-1">
        <Input
          placeholder="Enter item description..."
          value={item.description}
          onChange={(e) => updateItem(checklistId, item.id, e.target.value)}
          className="w-full"
        />
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => removeItem(checklistId, item.id)}
        className="text-destructive hover:text-destructive"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
