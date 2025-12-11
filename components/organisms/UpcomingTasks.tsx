"use client";

import { Calendar, Clock, ArrowRight, RefreshCw } from "lucide-react";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Link from "next/link";
import { ItemStatus } from "@/types/workflow";
import Input from "@/components/atoms/Input";
import LoadingState from "@/components/molecules/LoadingState";
import { useUpcomingTasks } from "@/hooks/use-upcoming-tasks";

export default function UpcomingTasks() {
  const { tasks, isLoading, error, days, setDays, refresh } =
    useUpcomingTasks();

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setDays(value);
    }
  };

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
    .map((task) => ({
      ...task,
      createdAtDate: new Date(task.createdAt),
      updatedAtDate: new Date(task.updatedAt),
      expectClosingDateObj: task.expectClosingDate
        ? new Date(task.expectClosingDate)
        : null,
    }))
    .sort((a, b) => {
      if (!a.expectClosingDateObj || !b.expectClosingDateObj) return 0;
      return (
        a.expectClosingDateObj.getTime() - b.expectClosingDateObj.getTime()
      );
    });

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm">
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-primary/10 rounded-md">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Upcoming Tasks
              </h2>
              <p className="text-xs text-muted-foreground">
                Tasks expiring in the next {days} days
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-24">
              <Input
                type="number"
                min="1"
                value={days}
                onChange={handleDaysChange}
                className="h-8 text-xs"
                placeholder="Days"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={refresh}
              disabled={isLoading}
              className="h-8 w-8 p-0"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
            <Badge variant="default" className="text-xs font-medium">
              {sortedTasks.length}
            </Badge>
          </div>
        </div>
      </div>

      <div className="p-4">
        {isLoading ? (
          <LoadingState title="Loading tasks..." />
        ) : error ? (
          <div className="text-center py-8 text-destructive">
            <p>{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={refresh}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        ) : sortedTasks.length > 0 ? (
          <div className="space-y-2">
            {sortedTasks.slice(0, 10).map((task, index) => {
              const daysUntilDue = task.expectClosingDateObj
                ? getDaysUntilDue(task.expectClosingDateObj)
                : 0;
              const isOverdue = daysUntilDue < 0;
              const isDueSoon = daysUntilDue >= 0 && daysUntilDue <= 2;

              return (
                <div
                  key={`${task.transactionId}-${task.order}-${index}`}
                  className="group flex flex-col gap-2 p-2.5 rounded-sm border border-border bg-card/50 hover:bg-accent/40 hover:shadow-sm transition-all duration-200"
                >
                  {/* Header: Title & Status */}
                  <div className="flex items-start gap-3">
                    {/* Order - Large & Visible */}
                    <div className="shrink-0 flex items-center justify-center w-9 h-9 rounded-md bg-primary/5 font-bold text-lg text-primary border border-primary/10 shadow-sm">
                      {task.order}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-medium text-sm text-foreground leading-tight line-clamp-2 pt-0.5">
                          {task.description}
                        </h3>
                        <div className="shrink-0 scale-90 origin-top-right">
                          {getStatusBadge(task.status)}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-muted-foreground">
                        <span>
                          Created{" "}
                          {task.createdAtDate.toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        {task.updatedAtDate > task.createdAtDate && (
                          <span className="text-blue-600/90 dark:text-blue-400 font-medium">
                            Updated{" "}
                            {task.updatedAtDate.toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer: Due Date & Action */}
                  <div className="flex items-center justify-between pt-0.5">
                    {/* Due Date Info */}
                    <div className="flex items-center gap-2 text-xs">
                      {task.expectClosingDateObj && (
                        <div
                          className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded-sm border text-[11px] ${
                            isOverdue
                              ? "bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30"
                              : isDueSoon
                              ? "bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-900/30"
                              : "bg-muted/50 text-muted-foreground border-border/50"
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          <span className="font-medium">
                            {getDueDateText(task.expectClosingDateObj)}
                          </span>
                          <span className="opacity-60 border-l border-current pl-1.5 ml-0.5">
                            {task.expectClosingDateObj.toLocaleDateString(
                              undefined,
                              { month: "short", day: "numeric" }
                            )}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <Link
                      href={`/transaction-coordinator/transactions/${task.transactionId}`}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs hover:bg-primary hover:text-primary-foreground group-hover:translate-x-0.5 transition-all"
                      >
                        View
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}

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
