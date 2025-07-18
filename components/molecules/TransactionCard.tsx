"use client";

import {
  Calendar,
  User,
  Clock,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Tag,
  FileText,
} from "lucide-react";
import Badge from "../atoms/Badge";
import Button from "../atoms/Button";
import { useState } from "react";
import ProgressBar from "../atoms/ProgressBar";

// Función para formatear estados
const formatStatus = (status: string): string => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

interface TransactionCardProps {
  transaction: {
    transactionId: string;
    propertyAddress: string;
    transactionType: string;
    status: string;
    additionalNotes?: string | null;
    propertyValue: number;
    clientName: string | null;
    completedWorkflowItems: number;
    totalWorkflowItems: number;
    nextIncompleteItemDate?: string | null;
    createdAt: string;
    updatedAt?: string;
  };
  userRole: "agent" | "client";
  onViewDetails?: (id: string) => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  userRole,
  onViewDetails,
}) => {
  const [showNotes, setShowNotes] = useState(false);

  const statusVariant: Record<
    string,
    "error" | "warning" | "default" | "success"
  > = {
    preparation: "default",
    in_preparation: "default",
    active: "warning",
    under_contract: "default",
    sold_leased: "success",
    terminated: "error",
    withdrawn: "error",
  };

  // Aplicamos formatStatus a todos los estados
  const displayStatus = formatStatus(transaction.status);

  const progress =
    transaction.totalWorkflowItems > 0
      ? Math.round(
          (transaction.completedWorkflowItems /
            transaction.totalWorkflowItems) *
            100
        )
      : 0;

  const hasNotes = !!transaction.additionalNotes;
  const hasDeadline = !!transaction.nextIncompleteItemDate;

  return (
    <div className="bg-card rounded-lg p-4 border border-border hover:shadow-sm transition-shadow">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center mb-1">
            <h3 className="font-semibold text-foreground text-base mr-3">
              {transaction.propertyAddress}
            </h3>
            <Badge
              variant={statusVariant[transaction.status] ?? "default"}
              className=""
            >
              {displayStatus}
            </Badge>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Tag className="w-4 h-4 mr-1 text-secondary" />
            <span>{transaction.transactionType}</span>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onViewDetails?.(transaction.transactionId)}
        >
          View Details
        </Button>
      </div>

      {/* Core Information Section */}
      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
        <div className="flex items-center">
          <User className="w-4 h-4 mr-2 text-muted-foreground flex-shrink-0" />
          <div>
            <div className="text-xs text-muted-foreground">Client</div>
            <div
              className={
                transaction.clientName ? "text-foreground" : "text-warning"
              }
            >
              {transaction.clientName || "Not assigned"}
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <DollarSign className="w-4 h-4 mr-2 text-muted-foreground flex-shrink-0" />
          <div>
            <div className="text-xs text-muted-foreground">Property Value</div>
            <div>${Number(transaction.propertyValue).toLocaleString()}</div>
          </div>
        </div>
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2 text-muted-foreground flex-shrink-0" />
          <div>
            <div className="text-xs text-muted-foreground">Created</div>
            <div>{new Date(transaction.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
        {hasDeadline ? (
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-muted-foreground flex-shrink-0" />
            <div>
              <div className="text-xs text-muted-foreground">Next Deadline</div>
              <div>
                {new Date(
                  transaction.nextIncompleteItemDate!
                ).toLocaleDateString()}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-muted-foreground flex-shrink-0" />
            <div>
              <div className="text-xs text-muted-foreground">Deadline</div>
              <div>No deadline</div>
            </div>
          </div>
        )}
      </div>

      {/* Progress Section */}
      <div className={`${hasNotes ? "mb-3" : "mb-1"}`}>
        <div className="flex justify-between items-center text-sm mb-1">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
            <span>Progress: {progress}%</span>
          </div>
          <span>
            {transaction.completedWorkflowItems}/
            {transaction.totalWorkflowItems} tasks
          </span>
        </div>
        <ProgressBar
          value={progress}
          variant={
            transaction.status === "sold_leased"
              ? "success"
              : ["active", "under_contract"].includes(transaction.status)
              ? "secondary"
              : "primary"
          }
        />
      </div>

      {/* Additional Notes Section */}
      {hasNotes && (
        <div className="mt-3">
          <button
            className="flex items-center w-full text-sm text-muted-foreground hover:text-foreground"
            onClick={() => setShowNotes(!showNotes)}
          >
            {showNotes ? (
              <ChevronUp className="w-4 h-4 mr-2" />
            ) : (
              <ChevronDown className="w-4 h-4 mr-2" />
            )}
            <span className="flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              {showNotes ? "Hide Notes" : "Show Notes"}
            </span>
          </button>
          {showNotes && (
            <div className="mt-2 p-3 bg-muted/20 rounded-md text-sm">
              {transaction.additionalNotes}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionCard;
