import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import type { ChecklistTemplate } from "@/types/workflow-templates";
import { SortableItem } from "./SortableItem";

interface SortableChecklistProps {
  id: string;
  index: number;
  checklist: ChecklistTemplate;
  expanded: boolean;
  toggleExpansion: (id: string) => void;
  removeChecklist: (id: string) => void;
  updateChecklist: (
    id: string,
    field: keyof ChecklistTemplate,
    value: any
  ) => void;
  addItem: (checklistId: string) => void;
  updateItem: (
    checklistId: string,
    itemId: string,
    description: string
  ) => void;
  removeItem: (checklistId: string, itemId: string) => void;
  sensors: any;
}

export function SortableChecklist({
  id,
  index,
  checklist,
  expanded,
  toggleExpansion,
  removeChecklist,
  updateChecklist,
  addItem,
  updateItem,
  removeItem,
  sensors,
}: SortableChecklistProps) {
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
    <Card
      ref={setNodeRef}
      style={style}
      className="border-l-4 border-l-primary"
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GripVertical
              className="w-4 h-4 text-muted-foreground cursor-move"
              {...attributes}
              {...listeners}
            />
            <span className="text-sm font-medium text-muted-foreground">
              Checklist {index + 1}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => toggleExpansion(checklist.id)}
              className="p-1"
            >
              {expanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeChecklist(checklist.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`checklist-name-${checklist.id}`}>
                Checklist Name
              </Label>
              <Input
                id={`checklist-name-${checklist.id}`}
                placeholder="Enter checklist name..."
                value={checklist.name}
                onChange={(e) =>
                  updateChecklist(checklist.id, "name", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`checklist-desc-${checklist.id}`}>
                Description (Optional)
              </Label>
              <Input
                id={`checklist-desc-${checklist.id}`}
                placeholder="Enter description..."
                value={checklist.description}
                onChange={(e) =>
                  updateChecklist(checklist.id, "description", e.target.value)
                }
              />
            </div>
          </div>
          {/* Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Checklist Items</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addItem(checklist.id)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
            {checklist.items.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground text-sm">
                No items added yet. Click "Add Item" to add checklist items.
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={({ active, over }) => {
                  if (!over || active.id === over.id) return;
                  const newItems = arrayMove(
                    checklist.items,
                    checklist.items.findIndex((i) => i.id === active.id),
                    checklist.items.findIndex((i) => i.id === over.id)
                  ).map((item, idx) => ({
                    ...item,
                    order: idx + 1,
                  }));
                  updateChecklist(checklist.id, "items", newItems);
                }}
              >
                <SortableContext
                  items={checklist.items.map((item) => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {checklist.items.map((item, itemIndex) => (
                      <SortableItem
                        key={item.id}
                        id={item.id}
                        checklistId={checklist.id}
                        item={item}
                        itemIndex={itemIndex}
                        updateItem={updateItem}
                        removeItem={removeItem}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
