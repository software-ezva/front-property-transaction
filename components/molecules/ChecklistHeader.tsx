import { ChevronDown, ChevronRight } from "lucide-react";
import { Checklist, ItemStatus } from "@/types/workflow";

interface ChecklistHeaderProps {
  checklist: Checklist;
  isExpanded: boolean;
  completedCount: number;
  totalCount: number;
  progress: number;
  checklistStatus: ItemStatus;
  onToggle: (checklistId: string) => void;
  getStatusIcon: (status: ItemStatus) => React.ReactNode;
  getStatusBadge: (status: ItemStatus) => React.ReactNode;
}

export default function ChecklistHeader({
  checklist,
  isExpanded,
  completedCount,
  totalCount,
  progress,
  checklistStatus,
  onToggle,
  getStatusIcon,
  getStatusBadge,
}: ChecklistHeaderProps) {
  return (
    <div
      className="flex items-center space-x-3 cursor-pointer hover:bg-muted/30 rounded-lg p-2 transition-colors"
      onClick={() => onToggle(checklist.id)}
    >
      <div className="flex-shrink-0">{getStatusIcon(checklistStatus)}</div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">
            {checklist.name}
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">
              {completedCount}/{totalCount} tasks
            </span>
            {getStatusBadge(checklistStatus)}
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </div>

        <div className="mt-1">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all ${
                checklistStatus === ItemStatus.COMPLETED
                  ? "bg-green-500"
                  : checklistStatus === ItemStatus.IN_PROGRESS
                  ? "bg-blue-500"
                  : "bg-muted-foreground"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
