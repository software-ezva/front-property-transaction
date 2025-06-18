"use client"

import { Calendar, User, Clock } from "lucide-react"
import Badge from "../atoms/Badge"
import Button from "../atoms/Button"

interface TransactionCardProps {
  transaction: {
    id: string
    propertyTitle: string
    clientName: string
    agentName: string
    status: "pending" | "in-progress" | "completed" | "cancelled"
    startDate: string
    completedTasks: number
    totalTasks: number
    nextDeadline?: string
  }
  userRole: "agent" | "client"
  onViewDetails?: (id: string) => void
}

const TransactionCard = ({ transaction, userRole, onViewDetails }: TransactionCardProps) => {
  const statusVariant = {
    pending: "warning" as const,
    "in-progress": "default" as const,
    completed: "success" as const,
    cancelled: "error" as const,
  }

  const statusLabels = {
    pending: "Pending",
    "in-progress": "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
  }

  const progress = (transaction.completedTasks / transaction.totalTasks) * 100

  return (
    <div className="bg-card rounded-lg p-4 border border-border hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1">{transaction.propertyTitle}</h3>
          <div className="flex items-center text-sm text-muted-foreground space-x-4">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              <span>{userRole === "agent" ? transaction.clientName : transaction.agentName}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{new Date(transaction.startDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <Badge variant={statusVariant[transaction.status]}>{statusLabels[transaction.status]}</Badge>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {transaction.completedTasks}/{transaction.totalTasks} tasks
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {transaction.nextDeadline && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="w-4 h-4 mr-1" />
            <span>Next deadline: {new Date(transaction.nextDeadline).toLocaleDateString()}</span>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button size="sm" variant="outline" onClick={() => onViewDetails?.(transaction.id)}>
            View Details
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TransactionCard
