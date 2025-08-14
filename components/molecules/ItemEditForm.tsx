import { useState } from "react";
import { Calendar, Save, X } from "lucide-react";
import { Item, ItemStatus } from "@/types/workflow";
import Button from "@/components/atoms/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ItemEditFormProps {
  item: Item;
  onSave: (itemId: string, updates: Partial<Item>) => void;
  onCancel: () => void;
}

// Helper function to convert enum value to human-readable label
const getStatusLabel = (status: ItemStatus): string => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// Generate status options dynamically from the enum
const statusOptions = Object.values(ItemStatus).map((status) => ({
  value: status,
  label: getStatusLabel(status),
}));

export default function ItemEditForm({
  item,
  onSave,
  onCancel,
}: ItemEditFormProps) {
  const [status, setStatus] = useState<ItemStatus>(item.status);
  const [dueDate, setDueDate] = useState(item.expectClosingDate || "");

  // Helper to check if there are any changes
  const hasChanges = () => {
    const statusChanged = status !== item.status;
    const originalDate = item.expectClosingDate || "";
    const dateChanged = dueDate !== originalDate;

    return statusChanged || dateChanged;
  };

  const handleSave = () => {
    const updates: Partial<Item> = {};

    // Solo incluir status si cambió
    if (status !== item.status) {
      updates.status = status;
    }

    // Manejar cambios de fecha
    const originalDate = item.expectClosingDate || "";
    const newDate = dueDate;

    if (newDate !== originalDate) {
      if (newDate === "") {
        // Para eliminar la fecha, enviar cadena vacía que sí se serializa en JSON
        updates.expectClosingDate = "";
      } else {
        updates.expectClosingDate = newDate;
      }
    }

    // Solo hacer la llamada si hay cambios
    if (Object.keys(updates).length > 0) {
      onSave(item.id, updates);
    } else {
      // Si no hay cambios, simplemente cancelar
      onCancel();
    }
  };

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return "";
      return date.toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  const getDisplayDate = () => {
    return dueDate ? formatDateForInput(dueDate) : "";
  };

  return (
    <div className="border rounded-lg p-4 bg-background shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm">Edit Task</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="h-6 w-6 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {/* Task description (read-only) */}
        <div>
          <Label className="text-xs font-medium text-muted-foreground">
            Task
          </Label>
          <p className="text-sm mt-1 p-2 bg-muted/20 rounded border text-foreground">
            {item.description}
          </p>
        </div>

        {/* Status selection */}
        <div>
          <Label className="text-xs font-medium text-muted-foreground">
            Status
          </Label>
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as ItemStatus)}
          >
            <SelectTrigger className="h-8 text-sm mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Due date */}
        <div>
          <Label className="text-xs font-medium text-muted-foreground">
            Due Date
          </Label>
          <div className="relative mt-1">
            <Input
              type="date"
              value={getDisplayDate()}
              onChange={(e) => setDueDate(e.target.value)}
              className="h-8 text-sm pr-8"
            />
            <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="h-7 px-3 text-xs"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={!hasChanges()}
            className="h-7 px-3 text-xs"
          >
            <Save className="w-3 h-3 mr-1" />
            {hasChanges() ? "Save Changes" : "No Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
