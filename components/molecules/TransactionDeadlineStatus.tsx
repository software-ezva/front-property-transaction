import { Calendar, AlertCircle } from "lucide-react";

interface TransactionDeadlineStatusProps {
  nextIncompleteItemDate?: string | null;
}

export default function TransactionDeadlineStatus({
  nextIncompleteItemDate,
}: TransactionDeadlineStatusProps) {
  if (nextIncompleteItemDate) {
    return (
      <div className="flex items-center gap-3 px-4 py-2 bg-muted/50 rounded-lg border border-border">
        <div className="p-2 bg-background rounded-md border border-border shadow-sm">
          <Calendar className="w-4 h-4 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            Next Due
          </span>
          <span className="text-sm font-medium text-foreground">
            {new Date(nextIncompleteItemDate).toLocaleDateString()}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-destructive/10 rounded-lg border border-destructive/20">
      <div className="p-2 bg-background rounded-md border border-destructive/20 shadow-sm">
        <AlertCircle className="w-4 h-4 text-destructive" />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-wider text-destructive/80 font-semibold">
          Action Required
        </span>
        <span className="text-sm font-medium text-destructive">
          Missing Deadlines
        </span>
      </div>
    </div>
  );
}
