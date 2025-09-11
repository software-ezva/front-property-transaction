import React from "react";
import { CheckCircle } from "lucide-react";
import TransactionCard from "./TransactionCard";
import type { Transaction } from "@/types/transactions";

interface TransactionWithProgressProps {
  transaction: Transaction;
  userRole: "agent" | "client";
  onViewDetails: (transactionId: string) => void;
  showProgressMessage?: boolean;
  className?: string;
}

const TransactionWithProgress = ({
  transaction,
  userRole,
  onViewDetails,
  showProgressMessage = true,
  className = "",
}: TransactionWithProgressProps) => {
  const progressPercentage = Math.round(
    (transaction.completedWorkflowItems / transaction.totalWorkflowItems) * 100
  );

  return (
    <div
      className={`bg-card rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow ${className}`}
    >
      <TransactionCard
        transaction={transaction}
        userRole={userRole}
        onViewDetails={() => onViewDetails(transaction.transactionId)}
      />

      {/* Motivational message based on progress */}
      {showProgressMessage && transaction.completedWorkflowItems > 0 && (
        <div className="px-6 pb-4">
          <div className="bg-accent/10 rounded-lg p-3">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-accent mr-2" />
              <span className="text-sm text-accent font-medium">
                {progressPercentage}% complete - You're making excellent
                progress! 🎉
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionWithProgress;
