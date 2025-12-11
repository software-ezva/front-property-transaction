import { useState, useRef, useEffect } from "react";
import {
  Clock,
  Edit,
  History,
  Send,
  MessageSquarePlus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import { Item, ItemStatus } from "@/types/workflow";
import ItemEditForm from "./ItemEditForm";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";

interface ChecklistItemProps {
  item: Item;
  isEditing?: boolean;
  onEdit?: (itemId: string) => void;
  onSave?: (itemId: string, updates: Partial<Item>) => void;
  onCancelEdit?: () => void;
  onAddUpdate?: (itemId: string, content: string) => Promise<void>;
  getStatusIcon: (status: ItemStatus) => React.ReactNode;
  getStatusBadge: (status: ItemStatus) => React.ReactNode;
  formatDate: (dateString: string) => string;
  readOnly?: boolean;
}

export default function ChecklistItem({
  item,
  isEditing = false,
  onEdit,
  onSave,
  onCancelEdit,
  onAddUpdate,
  getStatusIcon,
  getStatusBadge,
  formatDate,
  readOnly = false,
}: ChecklistItemProps) {
  const [newUpdate, setNewUpdate] = useState("");
  const [isAddingUpdate, setIsAddingUpdate] = useState(false);
  const [isUpdatesExpanded, setIsUpdatesExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsUpdatesExpanded(false);
      }
    };

    if (isUpdatesExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUpdatesExpanded]);

  const handleAddUpdate = async () => {
    if (!newUpdate.trim() || !onAddUpdate) return;
    setIsAddingUpdate(true);
    try {
      await onAddUpdate(item.id, newUpdate);
      setNewUpdate("");
    } finally {
      setIsAddingUpdate(false);
    }
  };

  // Sort updates by createdAt descending (newest first)
  const sortedUpdates = [...(item.updates || [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // If in editing mode, show the edit form
  if (isEditing && onSave && onCancelEdit) {
    return <ItemEditForm item={item} onSave={onSave} onCancel={onCancelEdit} />;
  }

  // Normal display mode
  return (
    <Collapsible
      ref={containerRef}
      open={isUpdatesExpanded}
      onOpenChange={setIsUpdatesExpanded}
      className="group flex flex-col"
    >
      <div className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-muted/20 transition-colors">
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

          {/* Updates toggle button */}
          {((item.updates && item.updates.length > 0) || onAddUpdate) && (
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground gap-1.5"
                title={isUpdatesExpanded ? "Hide Updates" : "Show Updates"}
              >
                {item.updates && item.updates.length > 0 ? (
                  <>
                    <History className="w-3 h-3" />
                    <span>Updates ({item.updates.length})</span>
                  </>
                ) : (
                  <>
                    <MessageSquarePlus className="w-3 h-3" />
                    <span>Add Update</span>
                  </>
                )}
                {isUpdatesExpanded ? (
                  <ChevronUp className="w-3 h-3 ml-0.5" />
                ) : (
                  <ChevronDown className="w-3 h-3 ml-0.5" />
                )}
              </Button>
            </CollapsibleTrigger>
          )}

          {/* Edit button - only visible on hover and when editing is allowed */}
          {onEdit && !readOnly && (
            <Button
              variant="primary"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => onEdit(item.id)}
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Updates Section (Dropdown) */}
      <CollapsibleContent className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
        <div className="pl-8 pr-4 pb-2 pt-1">
          {/* Add Update Form */}
          {onAddUpdate && !readOnly && (
            <div className="flex gap-2 mb-3 mt-1 items-start">
              <Textarea
                value={newUpdate}
                onChange={(e) => setNewUpdate(e.target.value)}
                placeholder="Add an update..."
                className="flex-1 min-h-[60px]"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAddUpdate();
                  }
                }}
              />
              <Button
                onClick={handleAddUpdate}
                disabled={!newUpdate.trim() || isAddingUpdate}
                size="sm"
                className="h-10 w-10 p-0 mt-1"
              >
                {isAddingUpdate ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
          )}

          {/* Updates List */}
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {sortedUpdates.length > 0 ? (
              sortedUpdates.map((update) => (
                <div
                  key={update.id}
                  className="text-sm border-l-2 border-border pl-3 py-1"
                >
                  <p className="text-foreground mb-1">{update.content}</p>
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>{update.createdByName}</span>
                    <span>{new Date(update.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground py-1 italic">
                No updates yet.
              </p>
            )}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
