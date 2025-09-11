import { Clock, Edit } from "lucide-react";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { Item, ItemStatus } from "@/types/workflow";
import ItemEditForm from "./ItemEditForm";

interface ChecklistItemProps {
  item: Item;
  isEditing?: boolean;
  onEdit?: (itemId: string) => void;
  onSave?: (itemId: string, updates: Partial<Item>) => void;
  onCancelEdit?: () => void;
  getStatusIcon: (status: ItemStatus) => React.ReactNode;
  getStatusBadge: (status: ItemStatus) => React.ReactNode;
  formatDate: (dateString: string) => string;
}

export default function ChecklistItem({
  item,
  isEditing = false,
  onEdit,
  onSave,
  onCancelEdit,
  getStatusIcon,
  getStatusBadge,
  formatDate,
}: ChecklistItemProps) {
  // If in editing mode, show the edit form
  if (isEditing && onSave && onCancelEdit) {
    return <ItemEditForm item={item} onSave={onSave} onCancel={onCancelEdit} />;
  }

  // Normal display mode
  return (
    <div className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-muted/20 transition-colors group">
      {/* Left side: Icon + Description */}
      <div className="flex items-center space-x-2 flex-1 min-w-0">
        <div className="flex-shrink-0">{getStatusIcon(item.status)}</div>
        <p
          className={`text-sm truncate ${
            item.status === ItemStatus.COMPLETED
              ? "text-foreground line-through"
              : item.status === ItemStatus.IN_PROGRESS
              ? "text-foreground font-medium"
              : "text-muted-foreground"
          }`}
          title={item.description}
        >
          {item.description}
        </p>
      </div>

      {/* Right side: Due date + Status + Edit */}
      <div className="flex items-center space-x-2 flex-shrink-0">
        {/* Due date */}
        {item.expectClosingDate && (
          <span className="text-xs text-muted-foreground flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {formatDate(item.expectClosingDate)}
          </span>
        )}

        {/* Status badge */}
        {getStatusBadge(item.status)}

        {/* Edit button - only visible on hover and when editing is allowed */}
        {onEdit && (
          <Button
            variant="primary"
            size="sm"
            className="h-5 px-1.5 "
            onClick={() => onEdit(item.id)}
          >
            <Edit className="w-3 h-3" />
          </Button>
        )}
      </div>
    </div>
  );
}
