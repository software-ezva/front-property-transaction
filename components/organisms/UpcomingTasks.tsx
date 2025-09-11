import { Calendar, Clock, ArrowRight } from "lucide-react";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Link from "next/link";
import { ItemStatus } from "@/types/workflow";

interface UpcomingTaskItem {
  transactionId: string;
  description: string;
  order: number;
  status: ItemStatus;
  createdAt: Date;
  updatedAt: Date;
  expectClosingDate?: Date | null;
}

interface UpcomingTasksProps {
  tasks?: UpcomingTaskItem[];
}

// Mock data for upcoming tasks
const mockUpcomingTasks: UpcomingTaskItem[] = [
  {
    transactionId: "txn_001",
    description: "Property Appraisal Review",
    order: 5,
    status: ItemStatus.NOT_STARTED,
    createdAt: new Date("2025-01-12"),
    updatedAt: new Date("2025-01-12"),
    expectClosingDate: new Date("2025-09-07"), // Overdue (2 days ago)
  },
  {
    transactionId: "txn_002",
    description: "Home Inspection Report",
    order: 3,
    status: ItemStatus.IN_PROGRESS,
    createdAt: new Date("2025-01-10"),
    updatedAt: new Date("2025-01-15"),
    expectClosingDate: new Date("2025-09-08"), // Overdue (1 day ago)
  },
  {
    transactionId: "txn_003",
    description: "Final Walkthrough with Client",
    order: 11,
    status: ItemStatus.NOT_STARTED,
    createdAt: new Date("2025-01-08"),
    updatedAt: new Date("2025-01-08"),
    expectClosingDate: new Date("2025-09-09"), // Due Today
  },
  {
    transactionId: "txn_001",
    description: "Closing Document Preparation",
    order: 8,
    status: ItemStatus.IN_PROGRESS,
    createdAt: new Date("2025-01-14"),
    updatedAt: new Date("2025-01-16"),
    expectClosingDate: new Date("2025-09-10"), // Due Tomorrow
  },
  {
    transactionId: "txn_002",
    description: "Title Insurance Verification",
    order: 7,
    status: ItemStatus.NOT_STARTED,
    createdAt: new Date("2025-01-11"),
    updatedAt: new Date("2025-01-11"),
    expectClosingDate: new Date("2025-09-12"), // Due in 3 days
  },
  {
    transactionId: "txn_004",
    description: "Mortgage Approval Documentation",
    order: 4,
    status: ItemStatus.IN_PROGRESS,
    createdAt: new Date("2025-01-09"),
    updatedAt: new Date("2025-01-20"),
    expectClosingDate: new Date("2025-09-15"), // Due in 6 days
  },
];

export default function UpcomingTasks({
  tasks = mockUpcomingTasks,
}: UpcomingTasksProps) {
  const getStatusBadge = (status: ItemStatus) => {
    switch (status) {
      case ItemStatus.COMPLETED:
        return <Badge variant="success">Completed</Badge>;
      case ItemStatus.IN_PROGRESS:
        return <Badge variant="default">In Progress</Badge>;
      case ItemStatus.NOT_STARTED:
        return <Badge variant="warning">Not Started</Badge>;
      default:
        return <Badge variant="warning">Pending</Badge>;
    }
  };

  const getStatusColor = (status: ItemStatus) => {
    switch (status) {
      case ItemStatus.COMPLETED:
        return "text-green-600";
      case ItemStatus.IN_PROGRESS:
        return "text-blue-600";
      case ItemStatus.NOT_STARTED:
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  const getDaysUntilDue = (dueDate: Date) => {
    // Crear fechas sin tiempo para comparar solo las fechas
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);

    const timeDiff = due.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  const getDueDateText = (dueDate: Date) => {
    const days = getDaysUntilDue(dueDate);
    if (days < 0) return "Overdue";
    if (days === 0) return "Due today";
    if (days === 1) return "Due tomorrow";
    return `Due in ${days} days`;
  };

  const getDueDateColor = (dueDate: Date) => {
    const days = getDaysUntilDue(dueDate);
    if (days < 0) return "text-red-600";
    if (days <= 1) return "text-orange-600";
    if (days <= 3) return "text-yellow-600";
    return "text-muted-foreground";
  };

  // Sort tasks by due date (earliest first)
  const sortedTasks = tasks
    .filter((task) => task.expectClosingDate)
    .sort((a, b) => {
      if (!a.expectClosingDate || !b.expectClosingDate) return 0;
      return a.expectClosingDate.getTime() - b.expectClosingDate.getTime();
    });

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm">
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-primary/10 rounded-md">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Upcoming Tasks
              </h2>
              <p className="text-xs text-muted-foreground">
                Tasks with upcoming deadlines
              </p>
            </div>
          </div>
          <Badge variant="default" className="text-xs font-medium">
            {sortedTasks.length}
          </Badge>
        </div>
      </div>

      <div className="p-4">
        {sortedTasks.length > 0 ? (
          <div className="space-y-2">
            {sortedTasks.slice(0, 10).map((task, index) => (
              <div
                key={`${task.transactionId}-${task.order}-${index}`}
                className="border border-border rounded-lg p-2.5 bg-card hover:bg-accent/50 transition-all hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="font-medium text-sm text-foreground truncate">
                        {task.description}
                      </h3>
                      <div className="shrink-0">
                        {getStatusBadge(task.status)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-mono">
                          #{task.order}
                        </span>
                        <span className="text-muted-foreground">
                          Created: {task.createdAt.toLocaleDateString()}
                        </span>
                        {task.updatedAt > task.createdAt && (
                          <span className="text-blue-600 font-medium">
                            Updated: {task.updatedAt.toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      {task.expectClosingDate && (
                        <div className="flex items-center gap-2 shrink-0">
                          <Clock
                            className={`w-4 h-4 ${
                              getDaysUntilDue(task.expectClosingDate) < 0
                                ? "text-red-500"
                                : "text-muted-foreground"
                            }`}
                          />
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">
                              Expected:{" "}
                              {task.expectClosingDate.toLocaleDateString()}
                            </div>
                            <span
                              className={`text-xs font-bold ${getDueDateColor(
                                task.expectClosingDate
                              )} ${
                                getDaysUntilDue(task.expectClosingDate) < 0
                                  ? "bg-red-100 px-1 py-0.5 rounded"
                                  : ""
                              }`}
                            >
                              {getDueDateText(task.expectClosingDate)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 border-l border-border pl-2">
                    <Link href={`/agent/transactions/${task.transactionId}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-primary/10"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {sortedTasks.length > 10 && (
              <div className="text-center pt-1">
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  View All Tasks ({sortedTasks.length})
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No Upcoming Tasks
            </h3>
            <p className="text-muted-foreground">
              All your transaction tasks are on track or completed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
